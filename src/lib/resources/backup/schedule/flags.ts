import { Flags } from "@oclif/core";

export const backupScheduleFlagDefinitions = {
  description: Flags.custom<string>({
    summary: "Set the description for the backup schedule.",
    description:
      "Set the description for the given backup schedule to be displayed in mStudio and with the list command.",
  }),
  schedule: Flags.custom<string>({
    summary: "Set the interval at which the backup should be scheduled.",
    description:
      "Must be specified as a cron schedule expression. " +
      "Cannot be scheduled more often than once per hour. " +
      "Defines the interval at which the backup creation will be executed.",
  }),
  ttl: Flags.custom<string>({
    summary: "Define the backup retention period in days for backups created.",
    description:
      "Must be specified as an amount of days between 7 and 400 in the format [amount]d - e.g. '7d' for 7 days. " +
      "This will define the number of days the backup will be kept.",
  }),
};
