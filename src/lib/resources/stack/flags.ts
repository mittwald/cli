import FlagSetBuilder from "../../context/FlagSetBuilder.js";

export const {
  flags: stackFlags,
  args: stackArgs,
  withId: withStackId,
} = new FlagSetBuilder("stack", "s").build();
