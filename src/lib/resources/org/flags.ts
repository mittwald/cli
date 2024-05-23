import FlagSetBuilder from "../../context/FlagSetBuilder.js";
import { normalizeCustomerId } from "../../../normalize_id.js";

export const {
  flags: orgFlags,
  args: orgArgs,
  withId: withOrgId,
} = new FlagSetBuilder("org", "o", { normalize: normalizeCustomerId }).build();
