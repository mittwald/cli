import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { appInstallationArgs } from "../../lib/resources/app/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../rendering/react/components/Success.js";
import { ReactNode } from "react";

type Result = {
  appInstallationId: string;
};

export class Copy extends ExecRenderBaseCommand<typeof Copy, Result> {
  static description = "Copy an app within a project";
  static args = { ...appInstallationArgs };
  static flags = {
    ...processFlags,
    description: Flags.string({
      summary: "set a description for the new app installation",
      required: true,
    }),
  };

  protected async exec(): Promise<Result> {
    const appInstallationId = await this.withAppInstallationId(Copy);
    const { description } = this.flags;

    const p = makeProcessRenderer(this.flags, "Copying app installation");

    const result = await p.runStep("requesting app copy", async () => {
      const r = await this.apiClient.app.requestAppinstallationCopy({
        appInstallationId,
        data: {
          description,
        },
      });

      assertStatus(r, 201);

      return r.data;
    });

    p.complete(<Success>App successfully copied; have fun! 🚀</Success>);

    return { appInstallationId: result.id };
  }

  protected render(executionResult: Result): ReactNode {
    if (this.flags.quiet) {
      return executionResult.appInstallationId;
    }
  }
}
