import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { stackFlags, withStackId } from "../../lib/resources/stack/flags.js";
import { ReactNode } from "react";
import { Flags } from "@oclif/core";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { loadStackFromFile } from "../../lib/resources/stack/loader.js";
import { assertStatus } from "@mittwald/api-client";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { collectEnvironment } from "../../lib/resources/stack/env.js";
import { sanitizeStackDefinition } from "../../lib/resources/stack/sanitize.js";
import { enrichStackDefinition } from "../../lib/resources/stack/enrich.js";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";

interface DeployResult {
  restartedServices: string[];
}

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
    }),
    "env-file": Flags.file({
      summary: "alternative path to file with environment variables",
      default: "./.env",
    }),
  };

  protected async exec(): Promise<DeployResult> {
    const stackId = await withStackId(
      this.apiClient,
      Deploy,
      this.flags,
      this.args,
      this.config,
    );
    const { "compose-file": composeFile, "env-file": envFile } = this.flags;
    const r = makeProcessRenderer(this.flags, "Deploying container stack");

    const result: DeployResult = { restartedServices: [] };

    const env = await collectEnvironment(process.env, envFile);
    let stackDefinition = await loadStackFromFile(composeFile, env);

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
