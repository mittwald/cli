import { DDEVConfig } from "./config.js";
import { readFile } from "fs/promises";
import { load } from "js-yaml";
import { cwd } from "process";
import path from "path";
import { pathExists } from "../util/fs/pathExists.js";

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
