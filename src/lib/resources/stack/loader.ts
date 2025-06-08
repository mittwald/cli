import yaml from "js-yaml";
import * as fs from "fs";
import type { MittwaldAPIV2 } from "@mittwald/api-client";

type StackRequest =
  MittwaldAPIV2.Paths.V2StacksStackId.Put.Parameters.RequestBody;

function loadStackYAMLFromFile(file: string): string {
  if (file === "-") {
    return fs.readFileSync(process.stdin.fd, { encoding: "utf-8" });
  }
  return fs.readFileSync(file, { encoding: "utf-8" });
}

export async function loadStackFromFile(
  file: string,
  environment: Record<string, string>,
): Promise<StackRequest> {
  const input = loadStackYAMLFromFile(file);
  return loadStackFromStr(input, environment);
}

export async function loadStackFromStr(
  input: string,
  environment: Record<string, string>,
): Promise<StackRequest> {
  const stack = yaml.load(input) as StackRequest;

  const stackWithSubstitutedEnvironment = substituteEnvironmentVariables(
    stack,
    environment,
  );

  return stackWithSubstitutedEnvironment;
}

/**
 * This function aims to be a (more-or-less) complete implementation of Docker
 * Compose's variable interpolation feature.
 *
 * @param input Input object; may be anything coming out of a YAML file.
 * @param environment A record of environment variables
 * @see https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/
 */
function substituteEnvironmentVariables<T = unknown>(
  input: T,
  environment: Record<string, string>,
): T {
  if (typeof input === "string") {
    return input.replace(
      /\$\{(\w+)(:?-(.*))?}/g,
      (_, key, defExpr, def = "") => {
        const useDefaultIfNonEmpty = defExpr && defExpr.startsWith(":");
        if (useDefaultIfNonEmpty) {
          return environment[key] || def;
        }

        return key in environment ? environment[key] : def;
      },
    ) as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) =>
      substituteEnvironmentVariables(item, environment),
    ) as T;
  }

  if (input && typeof input === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      result[key] = substituteEnvironmentVariables(value, environment);
    }
    return result as T;
  }

  return input;
}
