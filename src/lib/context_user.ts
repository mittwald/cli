import {
  ContextKey,
  ContextMap,
  ContextProvider,
  WritableContextProvider,
} from "./context.js";
import fs from "fs/promises";
import path from "path";
import { Config } from "@oclif/core";

export class UserContextProvider
  implements ContextProvider, WritableContextProvider
{
  public name = "user";

  public constructor(private readonly config: Config) {}

  private get contextFile(): string {
    return path.join(this.config.configDir, "context.json");
  }

  public async getOverrides(): Promise<ContextMap> {
    try {
      const contents = await fs.readFile(this.contextFile, "utf-8");
      const rawValues = JSON.parse(contents);
      const source = { type: "user", identifier: this.contextFile };

      return Object.fromEntries(
        Object.entries(rawValues).map(([k, v]) => [k, { value: v, source }]),
      );
    } catch (e) {
      if (e instanceof Error && "code" in e && e.code === "ENOENT") {
        return {};
      }
      throw e;
    }
  }

  public async update(data: Record<ContextKey, string>): Promise<void> {
    const baseData = await this.getOverrides();
    const source = { type: "user", identifier: this.contextFile };

    for (const k of Object.keys(data) as ContextKey[]) {
      baseData[k] = { value: data[k], source };
    }

    await fs.writeFile(
      path.join(this.config.configDir, "context.json"),
      JSON.stringify(data),
      "utf-8",
    );
  }
}
