import { makeFlagSet } from "../context_flags.js";
import { normalizeCustomerIdToUuid } from "../../Helpers.js";

export const {
  flags: orgFlags,
  args: orgArgs,
  withId: withOrgId,
} = makeFlagSet("org", "o", normalizeCustomerIdToUuid);
