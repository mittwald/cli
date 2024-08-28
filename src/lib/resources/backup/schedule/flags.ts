import { Flags } from "@oclif/core";

export const backupScheduleFlagDefinitions = {
  description: Flags.custom<string>({
    description: "Set the description for the backup schedule",
  }),
  schedule: Flags.custom<string>({
    description: "Define the schedule itself",
  }),
  ttl: Flags.custom<string>({
    description:
      "Define the backup storage period in days, for through this schedule created backups",
  }),
};
