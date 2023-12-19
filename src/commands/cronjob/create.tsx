import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import { appInstallationFlags } from "../../lib/app/flags.js";

type Result = {
  cronjobId: string;
};

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static summary = "Create a new cron job";
  static flags = {
    ...appInstallationFlags,
    ...processFlags,
    description: Flags.string({
      required: true,
      summary: "Description of the cron job",
      default: undefined,
    }),
    interval: Flags.string({
      required: true,
      summary: "Interval of the cron job, in standard UNIX cron syntax",
      default: undefined,
    }),
    disable: Flags.boolean({
      summary: "Disable the cron job after creation",
      default: false,
    }),
    email: Flags.string({
      required: false,
      summary: "Email address to send cron job output to",
      default: undefined,
    }),
    url: Flags.string({
      required: false,
      summary:
        "URL to call for the cron job; either this or `--command` is required.",
      default: undefined,
      exclusive: ["command"],
    }),
    interpreter: Flags.string({
      required: false,
      summary: "Interpreter to use for the cron job",
      default: "/bin/sh",
    }),
    command: Flags.string({
      required: false,
      summary:
        "Command to execute for the cron job; either this or `--url` is required.",
      default: undefined,
      exclusive: ["url"],
    }),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Creating a new cron job");
    const appInstallationId = await this.withAppInstallationId(Create);

    const { description, interval, disable, email, url, interpreter, command } =
      this.flags;

    if (!url && !command) {
      throw new Error("either `--url` or `--command` must be specified");
    }

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

    const { id: cronjobId } = await p.runStep("creating cron job", async () => {
      const r = await this.apiClient.cronjob.createCronjob({
        projectId,
        data: {
          appId: appInstallationId,
          active: !disable,
          description,
          interval,
          email,
          destination: url ? { url } : { interpreter, path: command },
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

  protected render({ cronjobId }: Result): ReactNode {
    if (this.flags.quiet) {
      return cronjobId;
    }
  }
}
