import FlagSetBuilder from "../../context/FlagSetBuilder.js";
import { MittwaldAPIV2Client, assertStatus } from "@mittwald/api-client";
import { contextIDNormalizers } from "../../context/Context.js";

async function normalize(
  apiClient: MittwaldAPIV2Client,
  customerId: string,
): Promise<string> {
  const customer = await apiClient.customer.getCustomer({ customerId });
  assertStatus(customer, 200);

  return customer.data.customerId;
}

contextIDNormalizers["org-id"] = normalize;

export const {
  flags: orgFlags,
  args: orgArgs,
  withId: withOrgId,
} = new FlagSetBuilder("org", "o", {
  normalize,
  expectedShortIDFormat: {
    pattern: /^\d+$/,
    display: "000000",
  },
}).build();
