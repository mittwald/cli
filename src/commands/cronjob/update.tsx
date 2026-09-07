import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import { ReactNode } from "react";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { ProcessRenderer } from "../../rendering/process/process.js";
import { Success } from "../../rendering/react/components/Success.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { cronjobFlagDefinitions } from "../../lib/resources/cronjob/flags.js";
import {
  buildCronjobTarget,
  CronjobTarget,
  getCronjobServiceTarget,
} from "../../lib/resources/cronjob/target.js";
import { findContainerInProject } from "../../lib/resources/container/flags.js";
import Duration from "../../lib/units/Duration.js";

type CronjobCronjob = MittwaldAPIV2.Components.Schemas.CronjobCronjob;

type UpdateResult = void;

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description = "Update an existing cron job";
  static examples = [
    "# Change the schedule of a cron job\n<%= config.bin %> <%= command.id %> c-XXXXXX --interval '0 * * * *'",
    "# Change the command of a container cron job\n<%= config.bin %> <%= command.id %> c-XXXXXX --command 'php artisan schedule:run'",
    "# Move a container cron job to another container\n<%= config.bin %> <%= command.id %> c-XXXXXX --container-id othercontainer",
  ];
  static args = {
    "cronjob-id": Args.string({
      description: "ID of the cron job to be updated.",
      required: true,
    }),
  };
  static flags = {
    ...processFlags,
    "container-id": cronjobFlagDefinitions.containerId(),
    description: cronjobFlagDefinitions.description(),
    interval: cronjobFlagDefinitions.interval(),
    email: cronjobFlagDefinitions.email(),
    url: cronjobFlagDefinitions.url({
      exclusive: ["command"],
    }),
    command: cronjobFlagDefinitions.command({
      exclusive: ["url"],
    }),
    interpreter: cronjobFlagDefinitions.interpreter({
      dependsOn: ["command"],
    }),
    enable: Flags.boolean({
      exclusive: ["disable"],
      summary: "Enable the cron job.",
      description:
        "Set the status of the cron job to inactive. Automatic execution will be disabled.",
    }),
    disable: Flags.boolean({
      exclusive: ["enable"],
      summary: "Disable the cron job.",
      description:
        "Set the status of the cron job to active. Automatic execution will be enabled.",
    }),
    timeout: Duration.relativeFlag({
      summary: "Timeout after which the process will be killed.",
      description:
        "Common duration formats are supported (for example, '1h', '30m', '30s'). " +
        "Defines the amount of time after which a running cron job will be killed. " +
        "If an email address is defined, an error message will be sent.",
      required: false,
    }),
    timezone: cronjobFlagDefinitions.timezone(),
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(this.flags, "Updating cron job");
    const { "cronjob-id": cronjobId } = this.args;
    const currentCronjob = await this.apiClient.cronjob.getCronjob({
      cronjobId,
    });
    assertStatus(currentCronjob, 200);

    const { description, interval, email, timeout, enable, disable, timezone } =
      this.flags;

    if (Object.keys(this.flags).length == 0) {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
      return;
    }

    const target = await this.resolveUpdatedTarget(
      process,
      currentCronjob.data,
    );

    await process.runStep("Updating cron job", async () => {
      const response = await this.apiClient.cronjob.updateCronjob({
        cronjobId,
        data: {
          target,
          active: enable ? true : disable ? false : undefined,
          description,
          timeout: timeout?.seconds,
          email,
          interval,
          timeZone: timezone,
        },
      });
      assertSuccess(response);
    });

    await process.complete(
      <Success>Your cron job has successfully been updated.</Success>,
    );
  }

  /**
   * Builds the new execution target, or undefined if none of the target related
   * flags were given. A container cron job keeps its container when only the
   * command changes; an app cron job keeps its app installation.
   */
  private async resolveUpdatedTarget(
    process: ProcessRenderer,
    cronjob: CronjobCronjob,
  ): Promise<CronjobTarget | undefined> {
    const {
      "container-id": containerId,
      url,
      command,
      interpreter,
    } = this.flags;

    if (!containerId && !url && !command) {
      return undefined;
    }

    const currentServiceTarget = getCronjobServiceTarget(cronjob);

    if (containerId) {
      const { projectId } = cronjob;
      if (!projectId) {
        throw new Error("no project found for cron job");
      }

      const [serviceId, stackId] = await process.runStep(
        "fetching container",
        () => findContainerInProject(this.apiClient, projectId, containerId),
      );

      return buildCronjobTarget({
        container: { stackId, serviceId },
        url,
        command: command ?? currentServiceTarget?.command,
        interpreter,
      });
    }

    if (currentServiceTarget) {
      const { stackId, serviceShortId } = currentServiceTarget;
      const serviceId = await process.runStep(
        "fetching container",
        async () => {
          const r = await this.apiClient.container.getService({
            stackId,
            serviceId: serviceShortId,
          });
          assertStatus(r, 200);
          return r.data.id;
        },
      );

      return buildCronjobTarget({
        container: { stackId, serviceId },
        url,
        command,
        interpreter,
      });
    }

    return buildCronjobTarget({
      appInstallationId: cronjob.appInstallationId ?? cronjob.appId,
      url,
      command,
      interpreter,
    });
  }

  protected render(): ReactNode {
    return true;
  }
}
