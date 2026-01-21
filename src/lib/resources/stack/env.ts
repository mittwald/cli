import * as fs from "fs/promises";
import { pathExists } from "../../util/fs/pathExists.js";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import { getRandomValues } from "node:crypto";
import { parseEnvironmentVariablesFromStr } from "../../util/parser.js";

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
  const parsed = parseEnvironmentVariablesFromStr(defs);

  return { ...base, ...parsed };
}

/**
 * Fills in missing environment variables in the base environment.
 *
 * This is done by checking for special placeholder values:
 *
 * - `__PROMPT__`: prompts the user to input a value.
 * - `__GENERATE__`: generates a random base64-encoded string.
 */
export async function fillMissingEnvironmentVariables(
  base: NodeJS.ProcessEnv,
  renderer: ProcessRenderer,
): Promise<Record<string, string | undefined>> {
  const output = { ...base };

  for (const [key, value] of Object.entries(base)) {
    if (value === "__PROMPT__") {
      output[key] = await renderer.addInput(
        `enter value for environment variable ${key}`,
        false,
      );
    }

    if (value === "__GENERATE__") {
      renderer.addInfo(
        `generating random value for environment variable ${key}`,
      );

      output[key] = Buffer.from(getRandomValues(new Uint8Array(32))).toString(
        "base64",
      );
    }
  }

  return output;
}
