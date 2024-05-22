import { RenderBaseCommand } from "../../lib/basecommands/RenderBaseCommand.js";
import { ReactNode } from "react";
import { RenderJson } from "../../rendering/react/json/RenderJson.js";
import { GetBaseCommand } from "../../lib/basecommands/GetBaseCommand.js";
import { AppInstallationDetails } from "../../rendering/react/components/AppInstallation/AppInstallationDetails.js";
import { useApp, useAppInstallation } from "../../lib/resources/app/hooks.js";
import { appInstallationArgs } from "../../lib/resources/app/flags.js";

export default class Get extends RenderBaseCommand<typeof Get> {
  static description = "Get details about an app installation";
  static flags = { ...GetBaseCommand.baseFlags };
  static args = { ...appInstallationArgs };

  protected render(): ReactNode {
    const appInstallationId = this.useAppInstallationId(Get);
    const appInstallation = useAppInstallation(appInstallationId);

    if (this.flags.output === "json") {
      return <RenderJson name="appInstallation" data={appInstallation} />;
    }

    const app = useApp(appInstallation.appId);

    return (
      <AppInstallationDetails appInstallation={appInstallation} app={app} />
    );
  }
}
