import { normalizeProjectIdToUuid } from "../../Helpers.js";
import { makeFlagSet } from "../context_flags.js";

export const {
  flags: projectFlags,
  args: projectArgs,
  withId: withProjectId,
} = makeFlagSet("project", "p", { normalize: normalizeProjectIdToUuid });
