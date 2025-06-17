import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import FlagSetBuilder from "../../context/FlagSetBuilder.js";
import Context, { contextIDNormalizers } from "../../context/Context.js";

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
