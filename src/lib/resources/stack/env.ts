import * as fs from "fs/promises";
import { pathExists } from "../../util/fs/pathExists.js";
import { parseEnvironmentVariablesFromStr } from "../../util/parser.js";

export async function collectEnvironment(
  base: NodeJS.ProcessEnv,
  envFile: string,
): Promise<Record<string, string | undefined>> {
  if (!(await pathExists(envFile))) {
    return base;
  }

  const defs = await fs.readFile(envFile, { encoding: "utf-8" });
  const parsed = parseEnvironmentVariablesFromStr(defs);

  return { ...base, ...parsed };
}
