import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import FlagSetBuilder, { CommandType } from "../../context/FlagSetBuilder.js";
import Context, { contextIDNormalizers } from "../../context/Context.js";
import { withProjectId } from "../project/flags.js";
import { Config } from "@oclif/core";

async function normalize(
  apiClient: MittwaldAPIV2Client,
  serviceId: string,
  ctx: Context,
): Promise<string> {
  const { value: stackId } = await ctx.mustGetContextValue("stack-id");
  const result = await apiClient.container.getService({
    stackId,
    serviceId,
  });
  assertStatus(result, 200);

  return result.data.id;
}

contextIDNormalizers["container-id"] = normalize;

export const {
  flags: containerFlags,
  args: containerArgs,
  withId: withContainerId,
} = new FlagSetBuilder("container", "c", { normalize }).build();

export async function withContainerAndStackId(
  apiClient: MittwaldAPIV2Client,
  command: CommandType<"project"> | "flag" | "arg",
  flags: { [k: string]: unknown },
  args: { [k: string]: unknown },
  cfg: Config,
): Promise<[string, string]> {
  const projectId = await withProjectId(apiClient, command, flags, args, cfg);
  const containerId = flags["container-id"] ?? args["container-id"];

  if (typeof containerId !== "string") {
    throw new Error("container ID or short ID must be specified");
  }

  const containerResp = await apiClient.container.listServices({
    projectId,
  });

  assertStatus(containerResp, 200);

  for (const container of containerResp.data) {
    if (container.shortId === containerId || container.id === containerId) {
      return [container.id, container.stackId];
    }
  }

  throw new Error(`no container ${containerId} found in project ${projectId}`);
}
