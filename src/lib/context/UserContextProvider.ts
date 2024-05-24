import { ContextKey, ContextMap } from "./Context.js";
import fs from "fs/promises";
import path from "path";
import { Config } from "@oclif/core";
import ContextProvider from "./ContextProvider.js";
import WritableContextProvider from "./WritableContextProvider.js";
import { isNotFound } from "../util/fsutil.js";

export default class UserContextProvider
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
      if (isNotFound(e)) {
        return {};
      }
      throw e;
    }
  }

  public async reset(): Promise<void> {
    try {
      await fs.unlink(this.contextFile);
    } catch (e) {
      if (isNotFound(e)) {
        return;
      }
      throw e;
    }
  }

  public async update(updatedData: Record<ContextKey, string>): Promise<void> {
    const data = await this.getOverrides();
    const source = { type: "user", identifier: this.contextFile };

    for (const k of Object.keys(updatedData) as ContextKey[]) {
      data[k] = { value: updatedData[k], source };
    }

    const output: Record<string, string> = {};

    for (const k of Object.keys(data) as ContextKey[]) {
      const val = data[k]?.value;
      if (val !== undefined) {
        output[k] = val;
      }
    }

    await fs.mkdir(this.config.configDir, { recursive: true });
    await fs.writeFile(
      path.join(this.config.configDir, "context.json"),
      JSON.stringify(output),
      "utf-8",
    );
  }
}
