import fs from "fs/promises";
import { cwd } from "process";
import path from "path";
import { ContextKey, ContextMap } from "./Context.js";
import ContextProvider from "./ContextProvider.js";
import { pathExists } from "../util/fs/pathExists.js";
import InvalidContextError from "../error/InvalidContextError.js";

const dotfileName = ".mw-context.json";

/**
 * DotfileContextProvider is a ContextProvider that reads context overrides from
 * a local .mw-context.json file; it looks for the file in the current working
 * directory or any of its parent directories.
 *
 * The file format is a simple JSON object mapping context keys to string
 * values, e.g.:
 *
 * ```json
 * {
 *   "project-id": "p-xxxxx",
 *   "server-id": "s-xxxxx"
 * }
 * ```
 */
export default class DotfileContextProvider implements ContextProvider {
  public readonly name = "dotfile";

  public async getOverrides(): Promise<ContextMap> {
    const file = await this.findDotfile();
    if (!file) {
      return {};
    }

    const contents = await fs.readFile(file, "utf-8");

    let parsed: Partial<Record<ContextKey, string>>;
    try {
      parsed = JSON.parse(contents);
    } catch (err) {
      throw new InvalidContextError(`error while parsing ${file}: ${err}`, {
        cause: err,
      });
    }

    const source = { type: "dotfile", identifier: file };
    const overrides: ContextMap = {};

    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string") {
        overrides[key as ContextKey] = { value, source };
      }
    }

    return overrides;
  }

  /**
   * Find the .mw-context.json file in the current working directory or any of
   * its parent directories.
   */
  private async findDotfile(): Promise<string | undefined> {
    let currentDir = cwd();
    while (currentDir !== path.dirname(currentDir)) {
      const dotfile = path.join(currentDir, dotfileName);
      if (await pathExists(dotfile)) {
        return dotfile;
      }
      currentDir = path.dirname(currentDir);
    }
    return undefined;
  }
}
