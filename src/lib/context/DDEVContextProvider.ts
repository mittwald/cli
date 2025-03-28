import { ContextMap, ContextValueSource } from "./Context.js";
import { cwd } from "process";
import path from "path";
import fs from "fs/promises";
import yaml from "js-yaml";
import { DDEVConfig } from "../ddev/config.js";
import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import ContextProvider from "./ContextProvider.js";
import { pathExists } from "../util/fs/pathExists.js";
import InvalidContextError from "../error/InvalidContextError.js";

/**
 * DDEVContextProvider is a ContextProvider that reads context overrides from
 * local DDEV configuration files; it looks for a .ddev directory in the current
 * working directory or any of its parent directories and reads any
 * configuration yaml files from it.
 */
export default class DDEVContextProvider implements ContextProvider {
  name = "ddev";

  private apiClient: MittwaldAPIV2Client;

  public constructor(apiClient: MittwaldAPIV2Client) {
    this.apiClient = apiClient;
  }

  async getOverrides(): Promise<ContextMap> {
    const ddevConfigDir = await this.findDDEVConfigDir();
    if (!ddevConfigDir) {
      return {};
    }

    const configs = [
      "config.yaml",
      ...(await findDDEVConfigFiles(ddevConfigDir)),
    ];

    let overrides: ContextMap = {};

    for (const config of configs) {
      const configPath = path.join(ddevConfigDir, config);
      const contents = await fs.readFile(configPath, "utf-8");
      const parsed = yaml.load(contents) as Partial<DDEVConfig>;
      const source = { type: "ddev", identifier: configPath };

      for (const env of parsed.web_environment ?? []) {
        const [name, valueInput] = env.split("=", 2);
        if (name === "MITTWALD_APP_INSTALLATION_ID") {
          overrides = {
            ...overrides,
            ...(await this.fillOverridesFromAppInstallationId(
              source,
              valueInput,
            )),
          };
        }
      }
    }

    return overrides;
  }

  private async fillOverridesFromAppInstallationId(
    source: ContextValueSource,
    appInstallationId: string,
  ): Promise<ContextMap> {
    try {
      const response = await this.apiClient.app.getAppinstallation({
        appInstallationId,
      });
      assertStatus(response, 200);

      const out: ContextMap = {
        "installation-id": { value: response.data.id, source },
      };

      if (response.data.projectId) {
        out["project-id"] = {
          value: response.data.projectId,
          source,
        };
      }

      return out;
    } catch (err) {
      throw new InvalidContextError(
        `error while getting app installation ${appInstallationId}: ${err}`,
        { cause: err },
      );
    }
  }

  /**
   * Find the .ddev directory in the current working directory or any of its
   * parent directories.
   */
  private async findDDEVConfigDir(): Promise<string | undefined> {
    let currentDir = cwd();
    while (currentDir !== "/") {
      const ddevDir = path.join(currentDir, ".ddev", "config.yaml");
      if (await pathExists(ddevDir)) {
        return path.dirname(ddevDir);
      }

      currentDir = path.dirname(currentDir);
    }
    return undefined;
  }
}

async function findDDEVConfigFiles(dir: string): Promise<string[]> {
  const configFilePattern = /^config\..*\.ya?ml$/;
  return (await fs.readdir(dir)).filter((e) => configFilePattern.test(e));
}
