import type { MittwaldAPIV2Client } from "@mittwald/api-client";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import { findContainerInProject } from "../container/flags.js";
import { buildCronjobTarget, CronjobTarget } from "./target.js";

export type CronjobTargetFlags = {
  url?: string;
  command?: string;
  interpreter?: string;
};

/**
 * Resolves a container (by ID, short ID or service name) within a project and
 * builds the service target of a cron job running inside it.
 */
export async function resolveContainerTarget(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  projectId: string,
  containerId: string,
  flags: CronjobTargetFlags,
): Promise<CronjobTarget> {
  const [serviceId, stackId] = await process.runStep("fetching container", () =>
    findContainerInProject(apiClient, projectId, containerId),
  );

  return buildCronjobTarget({ container: { stackId, serviceId }, ...flags });
}
