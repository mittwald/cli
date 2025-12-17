import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { stackFlags, withStackId } from "../../lib/resources/stack/flags.js";
import { ReactNode } from "react";
import { Flags } from "@oclif/core";
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
import { collectEnvironment } from "../../lib/resources/stack/env.js";
import { sanitizeStackDefinition } from "../../lib/resources/stack/sanitize.js";
import { enrichStackDefinition } from "../../lib/resources/stack/enrich.js";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import { loadStackFromTemplate } from "../../lib/resources/stack/template-loader.js";
import { parse } from "envfile";

interface DeployResult {
  restartedServices: string[];
}

type StackRequest =
  MittwaldAPIV2.Paths.V2StacksStackId.Put.Parameters.RequestBody;

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
  };

  private async loadStackDefinition(
    source: { template: string } | { composeFile: string },
    envFile: string,
    renderer: ReturnType<typeof makeProcessRenderer>,
  ): Promise<StackRequest> {
    if ("template" in source) {
      // Load from GitHub template
      const { composeYaml, envContent } = await renderer.runStep(
        "fetching template from GitHub",
        () => loadStackFromTemplate(source.template),
      );

      // Build environment: start with process.env, then template .env, then local --env-file
      let env: Record<string, string | undefined> = { ...process.env };
      if (envContent) {
        const templateEnv = parse(envContent);
        env = { ...env, ...templateEnv };
      }
      env = await collectEnvironment(env, envFile);

      return loadStackFromStr(composeYaml, env);
    }

    // Load from local file
    const env = await collectEnvironment(process.env, envFile);
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

    const result: DeployResult = { restartedServices: [] };

    let stackDefinition = await this.loadStackDefinition(
      fromTemplate ? { template: fromTemplate } : { composeFile },
      envFile,
      r,
    );

    stackDefinition = sanitizeStackDefinition(stackDefinition);
    stackDefinition = await r.runStep("getting image configurations", () =>
      enrichStackDefinition(stackDefinition),
    );

    this.debug("complete stack definition: %O", stackDefinition);

    const declaredStack = await r.runStep("deploying stack", async () => {
      const resp = await this.apiClient.container.declareStack({
        stackId,
        data: stackDefinition,
      });

      assertStatus(resp, 200);
      return resp.data;
    });

    for (const service of declaredStack.services ?? []) {
      if (service.requiresRecreate) {
        await r.runStep(
          `recreating service ${service.serviceName}`,
          async () => {
            const resp = await this.apiClient.container.recreateService({
              stackId,
              serviceId: service.id,
            });
            assertSuccess(resp);
            result.restartedServices.push(service.serviceName);
          },
        );
      }
    }

    return result;
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
