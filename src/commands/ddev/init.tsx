import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import { appInstallationArgs } from "../../lib/app/flags.js";
import React from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { DDEVConfigBuilder } from "../../lib/ddev/config_builder.js";
import yaml from "js-yaml";
import { spawnInProcess } from "../../rendering/process/process_exec.js";
import { Flags } from "@oclif/core";
import { DDEVInitSuccess } from "../../rendering/react/components/DDEV/DDEVInitSuccess.js";

export class Init extends ExecRenderBaseCommand<typeof Init, void> {
  static summary =
    "initialize a new ddev configuration in the current directory";
  static description =
    "This command initializes a new ddev configuration in the current directory.";

  static flags = {
    ...processFlags,
    "project-name": Flags.string({
      summary: "DDEV project name",
      description: "The name of the DDEV project",
      required: false,
      default: undefined,
    }),
    "override-mittwald-plugin": Flags.string({
      summary: "override the mittwald plugin",
      description:
        "This flag allows you to override the mittwald plugin that should be installed by default; this is useful for testing purposes",
      default: "mittwald/ddev",
    }),
  };
  static args = {
    ...appInstallationArgs,
  };

  protected async exec(): Promise<void> {
    const appInstallationId = await this.withAppInstallationId(Init);
    const r = makeProcessRenderer(this.flags, "Initializing DDEV project");

    const { "override-mittwald-plugin": mittwaldPlugin } = this.flags;
    let { "project-name": projectName } = this.flags;

    const config = await r.runStep(
      "creating mittwald-specific DDEV configuration",
      async () => {
        const builder = new DDEVConfigBuilder(this.apiClient);
        const config = await builder.build(appInstallationId, "auto");

        await mkdir(".ddev", { recursive: true });
        await writeFile(
          path.join(".ddev", "config.mittwald.yaml"),
          yaml.dump(config),
        );

        return config;
      },
    );

    if (!projectName) {
      projectName = await r.addInput("Enter the project name", false);
    }

    const ddevArgs = [
      "--project-name",
      projectName,
      "--web-environment-add",
      `MITTWALD_APP_INSTALLATION_ID=${appInstallationId}`,
    ];

    if (config.type) {
      ddevArgs.push("--project-type", config.type);
    }

    await spawnInProcess(r, "initializing DDEV project", "ddev", [
      "config",
      ...ddevArgs,
    ]);

    await spawnInProcess(r, "installing mittwald plugin", "ddev", [
      "get",
      mittwaldPlugin,
    ]);

    await r.complete(<DDEVInitSuccess />);
  }

  protected render(): React.ReactNode {
    return undefined;
  }
}
