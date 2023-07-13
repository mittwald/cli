import { normalizeServerIdToUuid } from "../../Helpers.js";
import { makeFlagSet } from "../context_flags.js";

export const {
  flags: serverFlags,
  args: serverArgs,
  withId: withServerId,
} = makeFlagSet("server", "s", normalizeServerIdToUuid);
