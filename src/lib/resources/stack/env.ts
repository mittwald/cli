import * as fs from "fs/promises";
import { parse } from "envfile";
import { pathExists } from "../../util/fs/pathExists.js";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import { getRandomValues } from "node:crypto";

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
