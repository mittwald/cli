import fs from "fs/promises";
import { cwd } from "process";
import path from "path";
import { ContextMap, ContextProvider } from "./context.js";

export class TerraformContextProvider implements ContextProvider {
  public readonly name = "terraform";

  public async getOverrides(): Promise<ContextMap> {
    const file = await this.findTerraformStateFile();
    if (!file) {
      return {};
    }

    const contents = await fs.readFile(file, "utf-8");
    const data = JSON.parse(contents);
    const overrides: ContextMap = {};
    const source = { type: "terraform", identifier: file };

    const overrideID = (type: string): string | undefined => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = data.resources?.find((r: any) => r.type === type)?.instances[0]
        .attributes.id;
      return id;
    };

    const projectID = overrideID("mittwald_project");
    if (projectID) {
      overrides["project-id"] = { value: projectID, source };
    }

    const serverID = overrideID("mittwald_server");
    if (serverID) {
      overrides["server-id"] = { value: serverID, source };
    }

    const appID = overrideID("mittwald_app");
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
      try {
        await fs.stat(stateFile);
        return stateFile;
      } catch (e) {
        if (e instanceof Error && "code" in e && e.code === "ENOENT") {
          currentDir = path.dirname(currentDir);
          continue;
        }
        throw e;
      }
    }
    return undefined;
  }
}
