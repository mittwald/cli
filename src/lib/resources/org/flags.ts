import { makeFlagSet } from "../../context_flags.js";
import { normalizeCustomerId } from "../../../normalize_id.js";

export const {
  flags: orgFlags,
  args: orgArgs,
  withId: withOrgId,
} = makeFlagSet("org", "o", { normalize: normalizeCustomerId });
