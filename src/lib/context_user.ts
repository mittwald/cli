import {
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
  public constructor(private readonly config: Config) {}

  public async getOverrides(): Promise<ContextMap> {
    try {
      const contents = await fs.readFile(
        path.join(this.config.configDir, "context.json"),
        "utf-8",
      );
      return JSON.parse(contents);
    } catch (e) {
      if (e instanceof Error && "code" in e && e.code === "ENOENT") {
        return {};
      }
      throw e;
    }
  }

  public async persist(data: ContextMap): Promise<void> {
    await fs.writeFile(
      path.join(this.config.configDir, "context.json"),
      JSON.stringify(data),
      "utf-8",
    );
  }
}
