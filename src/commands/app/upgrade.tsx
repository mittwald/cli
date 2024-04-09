import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import { appInstallationArgs } from "../../lib/app/flags.js";
import { Flags } from "@oclif/core";
import { ReactNode } from "react";
import { getAppFromUuid, getAppVersionFromUuid } from "../../lib/app/uuid.js";
import { normalizeAppInstallationId } from "../../normalize_id.js";

export class UpgradeApp extends ExecRenderBaseCommand<
  typeof UpgradeApp,
  boolean
> {
  static description = "Upgrade target app to target version";
  static args = {
    ...appInstallationArgs,
  };
  static flags = {
    "installation-id": Flags.string({
      description: "target app to trigger upgrade for",
      required: false,
    }),
    "target-version": Flags.string({
      description: "target version to upgrade target app to",
      required: true,
      default: "latest",
    }),
  };

  protected async exec(): Promise<boolean> {
    let appInstallationId: string = checkInstallationIdInput(
      this.args["installation-id"],
      this.flags["installation-id"],
    );

    let appInstallation = await getAppFromUuid(
      this.apiClient,
      await normalizeAppInstallationId(this.apiClient, appInstallationId),
    );

    console.log(appInstallation);

    return false;
  }

  protected render(executionResult: boolean): ReactNode {
    return true;
  }
}

function checkInstallationIdInput(
  argInstallationId: string | undefined,
  flagInstallationId: string | undefined,
): string {
  if (!argInstallationId && !flagInstallationId) {
    throw Error(
      "No app installation id given. Please specify an app for the upgrade either as an argument or through the --installation-id=[] flag.",
    );
  } else if (
    argInstallationId &&
    flagInstallationId &&
    argInstallationId != flagInstallationId
  ) {
    throw Error(
      "Two different app installation ids given. Please specify one id either as an argument or through the --installation-id=[] flag.",
    );
  } else if (argInstallationId) {
    return argInstallationId;
  } else if (flagInstallationId) {
    return flagInstallationId;
  } else {
    throw Error("Something went wrong with the given app installation ids.");
  }
}
