import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import { appInstallationFlags } from "../../lib/resources/app/flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { findContainerInProject } from "../../lib/resources/container/flags.js";
import { cronjobFlagDefinitions } from "../../lib/resources/cronjob/flags.js";
import {
  buildCronjobTarget,
  CronjobTarget,
} from "../../lib/resources/cronjob/target.js";
import Duration from "../../lib/units/Duration.js";
import { Flags } from "@oclif/core";
import { ProcessRenderer } from "../../rendering/process/process.js";

type Result = {
  cronjobId: string;
};

type ResolvedTarget = {
  projectId: string;
  target: CronjobTarget;
};

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static summary = "Create a new cron job";
  static description =
    "A cron job either belongs to an app installation (see --installation-id) and requests a URL or runs a script, " +
    "or it belongs to a container (see --container-id) and runs a command inside that container.";
  static examples = [
    "# Run a PHP script in an app installation every night\n<%= config.bin %> <%= command.id %> -i a-XXXXXX --description 'nightly cleanup' --interval '0 2 * * *' --interpreter php --command 'cleanup.php --force'",
    "# Request a URL in an app installation every five minutes\n<%= config.bin %> <%= command.id %> -i a-XXXXXX --description 'heartbeat' --interval '*/5 * * * *' --url https://example.com/cron",
    "# Run a command in a container every minute\n<%= config.bin %> <%= command.id %> -c mycontainer --description 'scheduler' --interval '* * * * *' --command 'php artisan schedule:run'",
  ];
  static flags = {
    ...appInstallationFlags,
    ...projectFlags,
    ...processFlags,
    "container-id": cronjobFlagDefinitions.containerId({
      exclusive: ["installation-id"],
    }),
    description: cronjobFlagDefinitions.description({ required: true }),
    interval: cronjobFlagDefinitions.interval({ required: true }),
    email: cronjobFlagDefinitions.email(),
    url: cronjobFlagDefinitions.url({
      exactlyOne: ["url", "command"],
    }),
    command: cronjobFlagDefinitions.command({
      exactlyOne: ["url", "command"],
    }),
    interpreter: cronjobFlagDefinitions.interpreter({
      dependsOn: ["command"],
    }),
    disable: Flags.boolean({
      summary: "Disable the cron job.",
      description:
        "When creating a cron job it is enabled by default. " +
        "This flag can be used to set the status of the cron job to inactive when creating one. " +
        "Automatic execution will then be disabled until enabled manually.",
    }),
    timeout: Duration.relativeFlag({
      summary: "Timeout after which the process will be killed.",
      description:
        "Common duration formats are supported (for example, '1h', '30m', '30s'). " +
        "Defines the amount of time after which a running cron job will be killed. " +
        "If an email address is defined, an error message will be sent.",
      default: Duration.fromString("1h"),
      required: false,
    }),
    timezone: cronjobFlagDefinitions.timezone(),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Creating a new cron job");
    const {
      "container-id": containerId,
      description,
      interval,
      disable,
      email,
      timeout,
      timezone,
    } = this.flags;

    const { projectId, target } = containerId
      ? await this.resolveContainerTarget(p, containerId)
      : await this.resolveAppTarget(p);

    const { id: cronjobId } = await p.runStep("creating cron job", async () => {
      const r = await this.apiClient.cronjob.createCronjob({
        projectId,
        data: {
          active: !disable,
          description,
          interval,
          email,
          target,
          timeout: timeout.seconds,
          timeZone: timezone,
        },
      });

      assertStatus(r, 201);
      return r.data;
    });

    const cronjob = await p.runStep("fetching cron job", async () => {
      const r = await this.apiClient.cronjob.getCronjob({ cronjobId });
      assertStatus(r, 200);
      return r.data;
    });

    p.complete(
      <Success>
        The cron job <Value>{cronjob.shortId}</Value> was successfully created.
      </Success>,
    );

    return { cronjobId };
  }

  private async resolveContainerTarget(
    p: ProcessRenderer,
    containerId: string,
  ): Promise<ResolvedTarget> {
    const { url, command, interpreter } = this.flags;
    const projectId = await this.withProjectId(Create);

    const [serviceId, stackId] = await p.runStep("fetching container", () =>
      findContainerInProject(this.apiClient, projectId, containerId),
    );

    return {
      projectId,
      target: buildCronjobTarget({
        container: { stackId, serviceId },
        url,
        command,
        interpreter,
      }),
    };
  }

  private async resolveAppTarget(p: ProcessRenderer): Promise<ResolvedTarget> {
    const { url, command, interpreter } = this.flags;
    const appInstallationId = await this.withAppInstallationId(Create);

    const { projectId } = await p.runStep("fetching project", async () => {
      const r = await this.apiClient.app.getAppinstallation({
        appInstallationId,
      });
      assertStatus(r, 200);
      return r.data;
    });

    if (!projectId) {
      throw new Error("no project found for app installation");
    }

    return {
      projectId,
      target: buildCronjobTarget({
        appInstallationId,
        url,
        command,
        interpreter,
      }),
    };
  }

  protected render({ cronjobId }: Result): ReactNode {
    if (this.flags.quiet) {
      return cronjobId;
    }
  }
}
