import { appInstallationArgs } from "../../lib/app/flags.js";
import { ExtendedBaseCommand } from "../../ExtendedBaseCommand.js";
import { Flags } from "@oclif/core";
import { DDEVConfigBuilder } from "../../lib/ddev/config_builder.js";
import { renderDDEVConfig } from "../../lib/ddev/config_render.js";

export class RenderConfig extends ExtendedBaseCommand<typeof RenderConfig> {
  static summary =
    "Generate a DDEV configuration YAML file for the current app.";
  static description =
    "This command initializes a new ddev configuration in the current directory.";

  static flags = {
    "override-type": Flags.string({
      summary: "Override the type of the generated DDEV configuration",
      default: "auto",
      description:
        "The type of the generated DDEV configuration; this can be any of the documented DDEV project types, or 'auto' (which is also the default) for automatic discovery." +
        "" +
        "See https://ddev.readthedocs.io/en/latest/users/configuration/config/#type for more information",
    }),
  };

  static args = {
    ...appInstallationArgs,
  };

  public async run(): Promise<void> {
    const appInstallationId = await this.withAppInstallationId(RenderConfig);
    const projectType = this.flags["override-type"];

    const ddevConfigBuilder = new DDEVConfigBuilder(this.apiClient);
    const ddevConfig = await ddevConfigBuilder.build(
      appInstallationId,
      projectType,
    );

    this.log(renderDDEVConfig(appInstallationId, ddevConfig));
  }
}
