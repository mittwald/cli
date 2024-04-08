import { appInstallationArgs } from "../../lib/app/flags.js";
import { ExtendedBaseCommand } from "../../ExtendedBaseCommand.js";
import { DDEVConfigBuilder } from "../../lib/ddev/config_builder.js";
import { renderDDEVConfig } from "../../lib/ddev/config_render.js";
import { ddevFlags } from "../../lib/ddev/flags.js";

export class RenderConfig extends ExtendedBaseCommand<typeof RenderConfig> {
  static summary =
    "Generate a DDEV configuration YAML file for the current app.";
  static description =
    "This command initializes a new ddev configuration in the current directory.";

  static flags = {
    ...ddevFlags,
  };

  static args = {
    ...appInstallationArgs,
  };

  public async run(): Promise<void> {
    const appInstallationId = await this.withAppInstallationId(RenderConfig);
    const projectType = this.flags["override-type"];
    const databaseId = this.flags["without-database"]
      ? "none"
      : this.flags["database-id"];

    const ddevConfigBuilder = new DDEVConfigBuilder(this.apiClient);
    const ddevConfig = await ddevConfigBuilder.build(
      appInstallationId,
      databaseId,
      projectType,
    );

    this.log(renderDDEVConfig(appInstallationId, ddevConfig));
  }
}
