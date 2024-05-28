import FlagSetBuilder from "../../context/FlagSetBuilder.js";

export const {
  flags: backupFlags,
  args: backupArgs,
  withId: withBackupId,
} = new FlagSetBuilder("backup", "b", {
  retrieveFromContext: false,
}).build();
