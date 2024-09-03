import type { MittwaldAPIV2Client } from "@mittwald/api-client";

type CronjobCreationData = Parameters<
  MittwaldAPIV2Client["cronjob"]["createCronjob"]
>[0]["data"];

export function buildCronjobDestination(
  url: string | undefined,
  command: string | undefined,
  interpreter: string | undefined,
): CronjobCreationData["destination"] | undefined {
  if (url) {
    return { url };
  }

  if (command && interpreter) {
    return {
      interpreter: mapInterpreterToFullPath(interpreter),
      path: command as string,
    };
  }
  return undefined;
}

function mapInterpreterToFullPath(interpreter: string): string {
  switch (interpreter) {
    case "bash":
      return "/bin/bash";
    case "php":
      return "/usr/bin/php";
    default:
      throw new Error(
        "Interpreter shorthand '" + interpreter + "' could not be mapped.",
      );
  }
}
