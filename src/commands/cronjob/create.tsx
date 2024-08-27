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

import type { MittwaldAPIV2Client } from "@mittwald/api-client";

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
    url: cronjobFlagDefinitions.url(),
    command: cronjobFlagDefinitions.command(),
    interpreter: cronjobFlagDefinitions.interpreter(),
    active: cronjobFlagDefinitions.active({ required: true }),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Creating a new cron job");
    const appInstallationId = await this.withAppInstallationId(Create);

    const {
      description,
      interval,
      active,
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

    let destination: CronjobCreationData["destination"];
    if (url) {
      destination = { url };
    } else if (command && interpreter) {
      destination = { interpreter, path: command };
    } else if (!url && !command) {
      throw new Error("either `--url` or `--command` must be specified");
    } else if (command && !interpreter) {
      throw new Error("--interpreter flag is required when command is given");
    } else if (interpreter && !command) {
      throw new Error("--command flag is required when interpreter is given");
    } else {
      throw new Error("something went wrong trying to digest destination.");
    }

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
