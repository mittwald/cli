import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { stackFlags, withStackId } from "../../lib/resources/stack/flags.js";
import { ReactNode } from "react";
import { Flags, ux } from "@oclif/core";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import {
  loadStackFromFile,
  loadStackFromStr,
} from "../../lib/resources/stack/loader.js";
import { assertStatus, MittwaldAPIV2 } from "@mittwald/api-client";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import {
  collectEnvironment,
  fillMissingEnvironmentVariables,
} from "../../lib/resources/stack/env.js";
import { sanitizeStackDefinition } from "../../lib/resources/stack/sanitize.js";
import { enrichStackDefinition } from "../../lib/resources/stack/enrich.js";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import { loadStackFromTemplate } from "../../lib/resources/stack/template-loader.js";
import { parseEnvironmentVariablesFromStr } from "../../lib/util/parser.js";
import { RawStackInput } from "../../lib/resources/stack/types.js";

interface DeployResult {
  restartedServices: string[];
}

type StackRequest =
  MittwaldAPIV2.Paths.V2StacksStackId.Put.Parameters.RequestBody;
type ContainerStackResponse =
  MittwaldAPIV2.Components.Schemas.ContainerStackResponse;

export class Deploy extends ExecRenderBaseCommand<typeof Deploy, DeployResult> {
  static description =
    "Deploys a docker-compose compatible file to a mittwald container stack";
  static aliases = ["stack:up"];
  static flags = {
    ...stackFlags,
    ...processFlags,
    "compose-file": Flags.string({
      summary: 'path to a compose file, or "-" to read from stdin',
      default: "./docker-compose.yml",
      char: "c",
      exclusive: ["from-template"],
    }),
    "from-template": Flags.string({
      summary: "deploy from a GitHub template (e.g., mittwald/n8n)",
      description: `\
Fetch and deploy a stack from a GitHub template repository. Template names are automatically converted to repository names by prefixing "stack-template-" to the name part.

For example, "mittwald/n8n" resolves to the repository "mittwald/stack-template-n8n". The command fetches both docker-compose.yml and .env files from the main branch.

Environment variable precedence (from lowest to highest):
1. Template .env file (if present in the repository)
2. System environment variables (process.env)
3. Local --env-file (if specified)

This flag is mutually exclusive with --compose-file.`,
      exclusive: ["compose-file"],
    }),
    "env-file": Flags.file({
      summary: "alternative path to file with environment variables",
      default: "./.env",
    }),
    force: Flags.boolean({
      char: "f",
      summary: "do not ask for confirmation when containers will be deleted",
    }),
  };

  private findServicesToDelete(
    existingStack: ContainerStackResponse,
    newStackDefinition: RawStackInput,
  ): string[] {
    const existingServiceNames = (existingStack.services ?? []).map(
      (s) => s.serviceName,
    );
    const newServiceNames = Object.keys(newStackDefinition.services ?? {});

    return existingServiceNames.filter(
      (name) => !newServiceNames.includes(name),
    );
  }

  private async getExistingStack(
    stackId: string,
    renderer: ReturnType<typeof makeProcessRenderer>,
  ): Promise<ContainerStackResponse> {
    return renderer.runStep("retrieving current stack state", async () => {
      const resp = await this.apiClient.container.getStack({ stackId });
      assertStatus(resp, 200);
      return resp.data;
    });
  }

  private async confirmDeletion(
    servicesToDelete: string[],
    renderer: ReturnType<typeof makeProcessRenderer>,
  ): Promise<boolean> {
    if (servicesToDelete.length === 0) {
      return true;
    }

    renderer.addInfo(
      `the following containers will be deleted: ${servicesToDelete.join(", ")}`,
    );

    if (this.flags.force) {
      return true;
    }

    const confirmed = await renderer.addConfirmation(
      "do you want to continue and delete these containers?",
    );

    if (!confirmed) {
      renderer.addInfo("deployment cancelled by user");
      await renderer.complete(<></>);
      ux.exit(1);
    }

    return confirmed;
  }

  private async deployStack(
    stackId: string,
    stackDefinition: RawStackInput,
    renderer: ReturnType<typeof makeProcessRenderer>,
  ): Promise<ContainerStackResponse> {
    return renderer.runStep("deploying stack", async () => {
      const resp = await this.apiClient.container.declareStack({
        stackId,
        data: stackDefinition as StackRequest,
      });
      assertStatus(resp, 200);
      return resp.data;
    });
  }

  private async recreateServices(
    stackId: string,
    declaredStack: ContainerStackResponse,
    renderer: ReturnType<typeof makeProcessRenderer>,
  ): Promise<string[]> {
    const restartedServices: string[] = [];

    for (const service of declaredStack.services ?? []) {
      if (service.requiresRecreate) {
        await renderer.runStep(
          `recreating service ${service.serviceName}`,
          async () => {
            const resp = await this.apiClient.container.recreateService({
              stackId,
              serviceId: service.id,
            });
            assertSuccess(resp);
            restartedServices.push(service.serviceName);
          },
        );
      }
    }

    return restartedServices;
  }

  private async loadStackDefinition(
    source: { template: string } | { composeFile: string },
    envFile: string,
    existing: ContainerStackResponse,
    renderer: ReturnType<typeof makeProcessRenderer>,
  ): Promise<RawStackInput> {
    // Build environment: start with process.env, then template .env, then local --env-file
    let env: Record<string, string | undefined> = { ...process.env };

    if ("template" in source) {
      const hasServices = existing.services?.length ?? 0 > 0;
      if (hasServices) {
        throw new Error(
          "Re-applying templates to existing stacks is currently not supported.",
        );
      }

      // Load from GitHub template
      const { composeYaml, envContent } = await renderer.runStep(
        "fetching template from GitHub",
        () => loadStackFromTemplate(source.template),
      );

      if (envContent) {
        const templateEnv = parseEnvironmentVariablesFromStr(envContent);
        env = { ...env, ...templateEnv };
      }

      env = await collectEnvironment(env, envFile);
      env = await fillMissingEnvironmentVariables(env, renderer);

      return loadStackFromStr(composeYaml, env);
    }

    // Load from local file
    env = await collectEnvironment(env, envFile);

    return loadStackFromFile(source.composeFile, env);
  }

  protected async exec(): Promise<DeployResult> {
    const stackId = await withStackId(
      this.apiClient,
      Deploy,
      this.flags,
      this.args,
      this.config,
    );
    const {
      "compose-file": composeFile,
      "from-template": fromTemplate,
      "env-file": envFile,
    } = this.flags;
    const r = makeProcessRenderer(this.flags, "Deploying container stack");

    const existingStack = await this.getExistingStack(stackId, r);
    const stackSource = fromTemplate
      ? { template: fromTemplate }
      : { composeFile };

    let stackDefinition = await this.loadStackDefinition(
      stackSource,
      envFile,
      existingStack,
      r,
    );

    stackDefinition = sanitizeStackDefinition(stackDefinition);
    stackDefinition = await r.runStep("getting image configurations", () =>
      enrichStackDefinition(stackDefinition),
    );

    const servicesToDelete = this.findServicesToDelete(
      existingStack,
      stackDefinition,
    );
    const confirmed = await this.confirmDeletion(servicesToDelete, r);
    if (!confirmed) {
      return { restartedServices: [] };
    }

    const declaredStack = await this.deployStack(stackId, stackDefinition, r);
    const restartedServices = await this.recreateServices(
      stackId,
      declaredStack,
      r,
    );

    return { restartedServices };
  }

  protected render({ restartedServices }: DeployResult): ReactNode {
    if (restartedServices.length === 0) {
      return (
        <Success>Deployment successful. No services were restarted.</Success>
      );
    }

    return (
      <Success>
        Deployment successful. The following services were restarted:{" "}
        <Value>{restartedServices.join(", ")}</Value>
      </Success>
    );
  }
}
