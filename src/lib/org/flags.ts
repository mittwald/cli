import { makeFlagSet } from "../context_flags.js";

export const {
  flags: orgFlags,
  args: orgArgs,
  withId: withOrgId,
} = makeFlagSet("org", "o");
