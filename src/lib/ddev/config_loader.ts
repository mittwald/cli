import { DDEVConfig } from "./config.js";
import { readFile } from "fs/promises";
import { pathExists } from "../util/fsutil.js";
import { load } from "js-yaml";
import { cwd } from "process";
import path from "path";

export async function loadDDEVConfig(
  baseDir: string = cwd(),
): Promise<Partial<DDEVConfig> | undefined> {
  const configPath = path.join(baseDir, ".ddev", "config.yaml");
  if (!(await pathExists(configPath))) {
    return undefined;
  }

  const existing = await readFile(".ddev/config.yaml", "utf-8");
  return load(existing) as Partial<DDEVConfig>;
}
