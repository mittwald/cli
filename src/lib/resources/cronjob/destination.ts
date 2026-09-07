import type { MittwaldAPIV2 } from "@mittwald/api-client";

type CronjobDestination =
  | MittwaldAPIV2.Components.Schemas.CronjobCronjobUrl
  | MittwaldAPIV2.Components.Schemas.CronjobCronjobCommand;

export function buildCronjobDestination(
  url: string | undefined,
  command: string | undefined,
  interpreter: string | undefined,
): CronjobDestination {
  if (url) {
    return { url };
  }

  if (command && interpreter) {
    return {
      interpreter: mapInterpreterToFullPath(interpreter),
      path: command,
    };
  }

  throw new Error(
    "Url or command and interpreter combination could not be parsed.",
  );
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
