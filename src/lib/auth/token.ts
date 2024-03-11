import path from "path";
import fs from "fs/promises";
import { Config } from "@oclif/core";
import { isNotFound } from "../fsutil.js";

export function getTokenFilename(config: Config): string {
  return path.join(config.configDir, "token");
}

export async function readApiToken(
  config: Config,
): Promise<string | undefined> {
  return (
    readApiTokenFromEnvironment() ?? (await readApiTokenFromConfig(config))
  );
}

function readApiTokenFromEnvironment(): string | undefined {
  const token = process.env.MITTWALD_API_TOKEN;
  if (token === undefined) {
    return undefined;
  }
  return token.trim();
}

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
