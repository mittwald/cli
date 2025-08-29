import fs from "fs/promises";
import { cwd } from "process";
import path from "path";
import { ContextMap } from "./Context.js";
import ContextProvider from "./ContextProvider.js";
import { pathExists } from "../util/fs/pathExists.js";

interface TerraformInstance {
  attributes: Record<string, unknown>;
}

interface TerraformResource {
  mode: "data" | "managed";
  type: string;
  name: string;
  provider: string;
  instances: TerraformInstance[];
}

interface TerraformState {
  resources: TerraformResource[];
}

function overrideIDFromState(
  state: TerraformState,
  type: string,
): string | undefined {
  const instances = state.resources?.find(
    (r) => r.type === type && r.mode === "managed",
  )?.instances;
  if (instances === undefined) {
    return undefined;
  }

  // If the context cannot be determined unambiguously, don't use the Terraform
  // state at all.
  if (instances.length > 1) {
    return undefined;
  }

  const id = instances[0]?.attributes?.id;
  return typeof id === "string" ? id : undefined;
}

export default class TerraformContextProvider implements ContextProvider {
  public readonly name = "terraform";

  public async getOverrides(): Promise<ContextMap> {
    const file = await this.findTerraformStateFile();
    if (!file) {
      return {};
    }

    const contents = await fs.readFile(file, "utf-8");
    const state: TerraformState = JSON.parse(contents);
    const overrides: ContextMap = {};
    const source = { type: "terraform", identifier: file };

    const projectID = overrideIDFromState(state, "mittwald_project");
    if (projectID) {
      overrides["project-id"] = { value: projectID, source };
    }

    const serverID = overrideIDFromState(state, "mittwald_server");
    if (serverID) {
      overrides["server-id"] = { value: serverID, source };
    }

    const appID = overrideIDFromState(state, "mittwald_app");
    if (appID) {
      overrides["installation-id"] = { value: appID, source };
    }

    return overrides;
  }

  // Iterate through all parent directories and look for a terraform state file.
  private async findTerraformStateFile(): Promise<string | undefined> {
    let currentDir = cwd();
    while (currentDir !== "/") {
      const stateFile = path.join(currentDir, "terraform.tfstate");
      if (await pathExists(stateFile)) {
        return stateFile;
      }
      currentDir = path.dirname(currentDir);
    }
    return undefined;
  }
}
