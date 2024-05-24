import path from "path";
import fs from "fs/promises";
import { Config } from "@oclif/core";
import { isNotFound } from "../util/fsutil.js";

/**
 * Gets the filename in which the CLI should store the API token.
 *
 * @param config The CLI configuration object.
 */
export function getTokenFilename(config: Config): string {
  return path.join(config.configDir, "token");
}

/**
 * Reads the API token from the environment or the configuration file.
 *
 * @param config The CLI configuration object.
 */
export async function readApiToken(
  config: Config,
): Promise<string | undefined> {
  return (
    readApiTokenFromEnvironment() ?? (await readApiTokenFromConfig(config))
  );
}

/** Reads the API token from the MITTWALD_API_TOKEN environment variable. */
function readApiTokenFromEnvironment(): string | undefined {
  const token = process.env.MITTWALD_API_TOKEN;
  if (token === undefined) {
    return undefined;
  }
  return token.trim();
}

/**
 * Reads the API token from the configuration file.
 *
 * @param config The CLI configuration object.
 */
async function readApiTokenFromConfig(
  config: Config,
): Promise<string | undefined> {
  try {
    const tokenFileContents = await fs.readFile(
      getTokenFilename(config),
      "utf-8",
    );
    return tokenFileContents.trim();
  } catch (err) {
    if (isNotFound(err)) {
      return undefined;
    }

    throw err;
  }
}
