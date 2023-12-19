import { RenderBaseCommand } from "../../rendering/react/RenderBaseCommand.js";
import { ReactNode } from "react";
import { RenderJson } from "../../rendering/react/json/RenderJson.js";
import { GetBaseCommand } from "../../GetBaseCommand.js";
import { AppInstallationDetails } from "../../rendering/react/components/AppInstallation/AppInstallationDetails.js";
import { useApp, useAppInstallation } from "../../lib/app/hooks.js";
import {
  appInstallationArgs,
  withAppInstallationId,
} from "../../lib/app/flags.js";
import { usePromise } from "@mittwald/react-use-promise";

export default class Get extends RenderBaseCommand<typeof Get> {
  static description = "Get details about an app installation";
  static flags = { ...GetBaseCommand.baseFlags };
  static args = { ...appInstallationArgs };

  protected render(): ReactNode {
    const appInstallationId = this.useAppInstallationId(Get);
    const appInstallation = useAppInstallation(appInstallationId);
    const app = useApp(appInstallation.appId);

    if (this.flags.output === "json") {
      return <RenderJson name="appInstallation" data={appInstallation} />;
    }

    return (
      <AppInstallationDetails appInstallation={appInstallation} app={app} />
    );
  }
}
