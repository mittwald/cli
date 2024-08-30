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
import { cronjobFlagDefinitions } from "../../lib/resources/cronjob/flags.js";
import { buildCronjobDestination } from "../../lib/resources/cronjob/destination.js";

import type { MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";

type Result = {
  cronjobId: string;
};

type CronjobCreationData = Parameters<
  MittwaldAPIV2Client["cronjob"]["createCronjob"]
>[0]["data"];

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static summary = "Create a new cron job";
  static flags = {
    ...appInstallationFlags,
    ...processFlags,
    description: cronjobFlagDefinitions.description({ required: true }),
    interval: cronjobFlagDefinitions.interval({ required: true }),
    email: cronjobFlagDefinitions.email(),
    timeout: cronjobFlagDefinitions.timeout({ required: true }),
    url: cronjobFlagDefinitions.url({
      exactlyOne: ["url", "command"],
    }),
    command: cronjobFlagDefinitions.command({
      exactlyOne: ["url", "command"],
      dependsOn: ["interpreter"],
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
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Creating a new cron job");
    const appInstallationId = await this.withAppInstallationId(Create);

    const {
      description,
      interval,
      disable,
      email,
      url,
      interpreter,
      command,
      timeout,
    } = this.flags;

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

    let active: boolean = true;
    if (disable) {
      active = false;
    }

    const destination: CronjobCreationData["destination"] =
      buildCronjobDestination(url, command, interpreter) ??
      (() => {
        throw new Error(
          "Url or command and interpreter combination could not be parsed.",
        );
      })();

    const cronjobCreationData: CronjobCreationData = {
      appId: appInstallationId,
      active,
      description,
      interval,
      email,
      destination,
      timeout: timeout,
    };

    const { id: cronjobId } = await p.runStep("creating cron job", async () => {
      const r = await this.apiClient.cronjob.createCronjob({
        projectId,
        data: cronjobCreationData,
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
