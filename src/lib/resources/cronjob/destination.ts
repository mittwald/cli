import type { MittwaldAPIV2Client } from "@mittwald/api-client";

type CronjobCreationData = Parameters<
  MittwaldAPIV2Client["cronjob"]["createCronjob"]
>[0]["data"];

export function buildCronjobDestination(
  url: string | undefined,
  command: string | undefined,
  interpreter: string | undefined,
): CronjobCreationData["destination"] | undefined {
  let destination: CronjobCreationData["destination"];

  if (url) {
    destination = { url };
  } else if (command && interpreter) {
    let destinationInterpreter;
    if (interpreter == "bash") {
      destinationInterpreter = "/bin/bash";
    } else {
      destinationInterpreter = "/usr/bin/php";
    }

    destination = {
      interpreter: destinationInterpreter,
      path: command as string,
    };
  } else {
    return undefined;
  }
  return destination;
}
