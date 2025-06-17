import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import FlagSetBuilder from "../../context/FlagSetBuilder.js";
import { contextIDNormalizers } from "../../context/Context.js";

async function normalize(
  apiClient: MittwaldAPIV2Client,
  serverId: string,
): Promise<string> {
  const result = await apiClient.project.getServer({ serverId });
  assertStatus(result, 200);

  return result.data.id;
}

contextIDNormalizers["server-id"] = normalize;

export const {
  flags: serverFlags,
  args: serverArgs,
  withId: withServerId,
} = new FlagSetBuilder("server", "s", {
  normalize,
  expectedShortIDFormat: {
    pattern: /^s-.*/,
    display: "s-XXXXXX",
  },
}).build();
