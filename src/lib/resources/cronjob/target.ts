import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { buildCronjobDestination } from "./destination.js";

type CronjobCronjob = MittwaldAPIV2.Components.Schemas.CronjobCronjob;
type CronjobAppInstallationTarget =
  MittwaldAPIV2.Components.Schemas.CronjobAppInstallationTarget;
type CronjobServiceTarget =
  MittwaldAPIV2.Components.Schemas.CronjobServiceTarget;
type CronjobServiceTargetResponse =
  MittwaldAPIV2.Components.Schemas.CronjobServiceTargetResponse;

export type CronjobTarget = CronjobAppInstallationTarget | CronjobServiceTarget;

export type CronjobTargetInput = {
  /** Full ID of the app installation; ignored when a container is given. */
  appInstallationId?: string;
  /** Container (a service of a container stack) running the command. */
  container?: { stackId: string; serviceId: string };
  url?: string;
  command?: string;
  interpreter?: string;
};

/**
 * Builds the execution target of a cron job from the CLI inputs.
 *
 * Container cron jobs run a plain command inside a container; app cron jobs
 * either request a URL or run a script with an interpreter.
 */
export function buildCronjobTarget(input: CronjobTargetInput): CronjobTarget {
  const { appInstallationId, container, url, command, interpreter } = input;

  if (container) {
    if (url !== undefined || interpreter !== undefined) {
      throw new Error(
        "container cron jobs only support --command; --url and --interpreter cannot be used",
      );
    }
    if (!command) {
      throw new Error(
        "container cron jobs require a --command to execute in the container",
      );
    }
    return {
      stackId: container.stackId,
      serviceIdentifier: container.serviceId,
      command,
    };
  }

  if (!appInstallationId) {
    throw new Error(
      "either an app installation or a container must be specified as cron job target",
    );
  }

  return {
    appInstallationId,
    destination: buildCronjobDestination(url, command, interpreter),
  };
}

/**
 * Returns the service target of a cron job, or undefined for app cron jobs.
 * Container cron jobs carry a service target instead of an app id.
 */
export function getCronjobServiceTarget(
  cronjob: CronjobCronjob,
): CronjobServiceTargetResponse | undefined {
  const { target } = cronjob;
  return target && "stackId" in target ? target : undefined;
}
