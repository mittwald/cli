import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { appInstallationArgs } from "../../lib/resources/app/flags.js";
import React from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { DDEVConfigBuilder } from "../../lib/ddev/config_builder.js";
import { spawnInProcess } from "../../rendering/process/process_exec.js";
import { Flags } from "@oclif/core";
import { DDEVInitSuccess } from "../../rendering/react/components/DDEV/DDEVInitSuccess.js";
import { DDEVConfig, ddevConfigToFlags } from "../../lib/ddev/config.js";
import { ProcessRenderer } from "../../rendering/process/process.js";
import { renderDDEVConfig } from "../../lib/ddev/config_render.js";
import { loadDDEVConfig } from "../../lib/ddev/config_loader.js";
import { Value } from "../../rendering/react/components/Value.js";
import { ddevFlags } from "../../lib/ddev/flags.js";
import { compareSemVer } from "semver-parser";
import { assertStatus, type MittwaldAPIV2 } from "@mittwald/api-client";
import { readApiToken } from "../../lib/auth/token.js";
import { isNotFound } from "../../lib/util/fsutil.js";
import { dump, load } from "js-yaml";
import { determineDDEVDatabaseId } from "../../lib/ddev/init_database.js";
import {
  assertDDEVIsInstalled,
  determineDDEVVersion,
} from "../../lib/ddev/init_assert.js";
import {
  DDEVProjectType,
  determineProjectType,
} from "../../lib/ddev/init_projecttype.js";

type AppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;

export class Init extends ExecRenderBaseCommand<typeof Init, void> {
  static summary = "Initialize a new ddev project in the current directory.";
  static description =
    "This command initializes a new ddev configuration for an existing app installation in the current directory.\n" +
    "\n" +
    "More precisely, this command will do the following:\n\n" +
    "  1. Create a new ddev configuration file in the .ddev directory, appropriate for the reference app installation\n" +
    "  2. Initialize a new ddev project with the given configuration\n" +
    "  3. Install the official mittwald DDEV addon\n" +
    "  4. Add SSH credentials to the DDEV project\n" +
    "\n" +
    "This command can be run repeatedly to update the DDEV configuration of the project.\n" +
    "\n" +
    "Please note that this command requires DDEV to be installed on your system.";

  static flags = {
    ...processFlags,
    ...ddevFlags,
    "project-name": Flags.string({
      summary: "DDEV project name",
      description: "The name of the DDEV project",
      required: false,
      default: undefined,
    }),
    "override-mittwald-plugin": Flags.string({
      summary: "override the mittwald plugin",
      helpGroup: "Development",
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

    await assertDDEVIsInstalled(r);

    const ddevVersion = await determineDDEVVersion(r);
    const appInstallation = await this.getAppInstallation(r, appInstallationId);
    const projectType = await determineProjectType(
      r,
      this.apiClient,
      appInstallation,
      this.flags["override-type"] as DDEVProjectType | "auto",
    );
    const databaseId = await determineDDEVDatabaseId(
      r,
      this.apiClient,
      this.flags,
      appInstallation,
    );
    await this.writeAuthConfiguration(r);
    const config = await this.writeMittwaldConfiguration(
      r,
      appInstallationId,
      databaseId,
      projectType,
    );
    const projectName = await this.determineProjectName(r);

    await this.initializeDDEVProject(r, config, projectName, ddevVersion);
    await this.installMittwaldPlugin(r);
    await this.addSSHCredentials(r);

    await r.complete(<DDEVInitSuccess />);
  }

  protected render(): React.ReactNode {
    return undefined;
  }

  private async addSSHCredentials(r: ProcessRenderer) {
    await spawnInProcess(r, "adding SSH credentials to DDEV", "ddev", [
      "auth",
      "ssh",
    ]);
  }

  private async getAppInstallation(
    r: ProcessRenderer,
    appInstallationId: string,
  ): Promise<AppInstallation> {
    return r.runStep("fetching app installation", async () => {
      const r = await this.apiClient.app.getAppinstallation({
        appInstallationId,
      });
      assertStatus(r, 200);

      return r.data;
    });
  }

  private async installMittwaldPlugin(r: ProcessRenderer) {
    const { "override-mittwald-plugin": mittwaldPlugin } = this.flags;
    await spawnInProcess(r, "installing mittwald plugin", "ddev", [
      "get",
      mittwaldPlugin,
    ]);
  }

  private async initializeDDEVProject(
    r: ProcessRenderer,
    config: Partial<DDEVConfig>,
    projectName: string,
    ddevVersion: string,
  ): Promise<void> {
    const ddevFlags = [
      "config",
      "--project-name",
      projectName,
      ...ddevConfigToFlags(config),
    ];

    if (compareSemVer(ddevVersion, "1.22.7") < 0) {
      ddevFlags.push("--create-docroot");
    }

    this.debug("running %o %o", "ddev", ddevFlags);

    await spawnInProcess(r, "initializing DDEV project", "ddev", ddevFlags);
  }

  private async determineProjectName(r: ProcessRenderer): Promise<string> {
    const { "project-name": projectName } = this.flags;
    if (projectName) {
      return projectName;
    }

    const existing = await loadDDEVConfig();
    if (existing?.name) {
      r.addInfo(<InfoUsingExistingName name={existing.name} />);
      return existing.name;
    }

    return await r.addInput("Enter the project name", false);
  }

  /**
   * This steps writes the users API token to the local DDEV configuration file.
   * This is necessary to authenticate the DDEV project with the mittwald API.
   *
   * The token is written to the `web_environment` section of the
   * `config.local.yaml`, which _should_ be safe to store credentials in, as it
   * is in DDEV's default `.gitignore` file.
   */
  private async writeAuthConfiguration(r: ProcessRenderer) {
    // NOTE that config.local.yaml is in DDEV's default .gitignore file, so
    // it *should* be safe to store credentials in there.
    const configFile = path.join(".ddev", "config.local.yaml");
    const token = await readApiToken(this.config);

    await r.runStep("writing local-only DDEV configuration", async () => {
      try {
        const existing = await readFile(configFile, { encoding: "utf-8" });
        const parsed = load(existing) as Partial<DDEVConfig>;

        const alreadyContainsAPIToken = (parsed.web_environment ?? []).some(
          (e) => e.startsWith("MITTWALD_API_TOKEN="),
        );
        if (!alreadyContainsAPIToken) {
          parsed.web_environment = [
            ...(parsed.web_environment ?? []),
            `MITTWALD_API_TOKEN=${token}`,
          ];
          await writeContentsToFile(configFile, dump(parsed));
        }
      } catch (err) {
        if (isNotFound(err)) {
          const config: Partial<DDEVConfig> = {
            web_environment: [`MITTWALD_API_TOKEN=${token}`],
          };

          await writeContentsToFile(configFile, dump(config));
          return;
        } else {
          throw err;
        }
      }
    });
  }

  private async writeMittwaldConfiguration(
    r: ProcessRenderer,
    appInstallationId: string,
    databaseId: string | undefined,
    projectType: string,
  ) {
    const builder = new DDEVConfigBuilder(this.apiClient);

    return await r.runStep(
      "creating mittwald-specific DDEV configuration",
      async () => {
        const config = await builder.build(
          appInstallationId,
          databaseId,
          projectType,
        );
        const configFile = path.join(".ddev", "config.mittwald.yaml");

        await writeContentsToFile(
          configFile,
          renderDDEVConfig(appInstallationId, config),
        );

        return config;
      },
    );
  }
}

async function writeContentsToFile(
  filename: string,
  data: string,
): Promise<void> {
  const dirname = path.dirname(filename);

  await mkdir(dirname, { recursive: true });
  await writeFile(filename, data);
}

function InfoUsingExistingName({ name }: { name: string }) {
  return (
    <>
      using existing project name: <Value>{name}</Value>
    </>
  );
}
