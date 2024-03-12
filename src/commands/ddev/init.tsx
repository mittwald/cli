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
import { spawnInProcess } from "../../rendering/process/process_exec.js";
import { Flags } from "@oclif/core";
import { DDEVInitSuccess } from "../../rendering/react/components/DDEV/DDEVInitSuccess.js";
import { DDEVConfig, ddevConfigToFlags } from "../../lib/ddev/config.js";
import { hasBinary } from "../../lib/hasbin.js";
import { ProcessRenderer } from "../../rendering/process/process.js";
import { renderDDEVConfig } from "../../lib/ddev/config_render.js";
import { loadDDEVConfig } from "../../lib/ddev/config_loader.js";
import { Value } from "../../rendering/react/components/Value.js";
import { ddevFlags } from "../../lib/ddev/flags.js";
import { exec } from "child_process";
import { promisify } from "util";
import { compareSemVer } from "semver-parser";
import { assertStatus, type MittwaldAPIV2 } from "@mittwald/api-client";
import { Text } from "ink";

type AppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;

const execAsync = promisify(exec);

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

    const ddevVersion = await this.determineDDEVVersion(r);
    const appInstallation = await this.getAppInstallation(r, appInstallationId);
    const databaseId = await this.determineDatabaseId(r, appInstallation);
    const config = await this.writeMittwaldConfiguration(
      r,
      appInstallationId,
      databaseId,
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

  private async determineDDEVVersion(r: ProcessRenderer): Promise<string> {
    const { stdout } = await execAsync("ddev --version");
    const version = stdout.trim().replace(/^ddev version +/, "");

    r.addInfo(<InfoDDEVVersion version={version} />);

    return version;
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

  private async determineDatabaseId(
    r: ProcessRenderer,
    appInstallation: AppInstallation,
  ): Promise<string | undefined> {
    let databaseId: string | undefined = this.flags["database-id"];
    const withoutDatabase = this.flags["without-database"];

    if (withoutDatabase) {
      return undefined;
    }

    if (databaseId === undefined) {
      databaseId = (appInstallation.linkedDatabases ?? []).find(
        (db) => db.purpose === "primary",
      )?.databaseId;
    }

    if (databaseId !== undefined) {
      const mysqlDatabaseResponse =
        await this.apiClient.database.getMysqlDatabase({
          mysqlDatabaseId: databaseId,
        });
      assertStatus(mysqlDatabaseResponse, 200);

      r.addInfo(<InfoDatabase name={mysqlDatabaseResponse.data.name} />);
      return mysqlDatabaseResponse.data.name;
    }

    return await this.promptDatabaseFromUser(r, appInstallation);
  }

  private async promptDatabaseFromUser(
    r: ProcessRenderer,
    appInstallation: AppInstallation,
  ): Promise<string | undefined> {
    const { projectId } = appInstallation;
    if (!projectId) {
      throw new Error("app installation has no project ID");
    }

    const mysqlDatabaseResponse =
      await this.apiClient.database.listMysqlDatabases({ projectId });
    assertStatus(mysqlDatabaseResponse, 200);

    return await r.addSelect("select the database to use", [
      ...mysqlDatabaseResponse.data.map((db) => ({
        value: db.name,
        label: `${db.name} (${db.description})`,
      })),
      {
        value: undefined,
        label: "no database",
      },
    ]);
  }

  private async writeMittwaldConfiguration(
    r: ProcessRenderer,
    appInstallationId: string,
    databaseId: string | undefined,
  ) {
    const builder = new DDEVConfigBuilder(this.apiClient);

    return await r.runStep(
      "creating mittwald-specific DDEV configuration",
      async () => {
        const config = await builder.build(
          appInstallationId,
          databaseId,
          this.flags["override-type"],
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

async function assertDDEVIsInstalled(r: ProcessRenderer): Promise<void> {
  await r.runStep("check if DDEV is installed", async () => {
    if (!(await hasBinary("ddev"))) {
      throw new Error("this command requires DDEV to be installed");
    }
  });
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

function InfoDDEVVersion({ version }: { version: string }) {
  return (
    <>
      detected DDEV version: <Value>{version}</Value>
    </>
  );
}

function InfoDatabase({ name }: { name: string }) {
  return (
    <Text>
      using database: <Value>{name}</Value>
    </Text>
  );
}
