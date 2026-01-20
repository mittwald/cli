import * as fs from "fs/promises";
import { pathExists } from "../../util/fs/pathExists.js";

export const parse = (src: string): Record<string, string> => {
  const result: Record<string, string> = {};
  const lines = src.toString().split("\n");
  for (const line of lines) {
    const match = line.match(/^([^=:#]+?)[=:](.*)/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim(); // Modify this to preserve quotes
      result[key] = value; // Retain the original value without removing quotes
    }
  }
  return result;
};

export async function collectEnvironment(
  base: NodeJS.ProcessEnv,
  envFile: string,
): Promise<Record<string, string | undefined>> {
  if (!(await pathExists(envFile))) {
    return base;
  }

  const defs = await fs.readFile(envFile, { encoding: "utf-8" });
  const parsed = parse(defs);

  return { ...base, ...parsed };
}
