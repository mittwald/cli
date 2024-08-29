import { Flags } from "@oclif/core";

export const mysqlUserFlagDefinitions = {
  "database-id": Flags.custom<string>({
    required: true,
    summary: "MySQL database ID to create a user for.",
    description:
      "Can be specified as UUID or shortId. The user will be created for the specified database.",
  }),
  "access-level": Flags.custom<"full" | "readonly">({
    options: ["readonly", "full"],
    summary: "Set the access level permissions for the SFTP user.",
    description:
      "Must be specified as either readonly or full. Grant the user either read-only or full file read and write privileges.",
  }),
  description: Flags.custom<string>({
    summary: "Set the description for the MySQL user.",
    description:
      "Set the description for the given MySQL user, which will be displayed in mStudio and with the list command.",
  }),
  password: Flags.custom<string>({
    summary: "Password used for authentication",
    description:
      "Specify an authentication password to use when connecting to the database with this user.",
  }),
  "access-ip-mask": Flags.custom<string>({
    summary: "IP to restrict external access to.",
    description:
      "If specified as IPv4, external access will be restricted to only the specified IP addresses when external access is enabled.",
  }),
  "external-access": Flags.custom<boolean>({
    summary: "Enable or disable external access.",
    description:
      "Specified as a boolean value will enable (true) or disable (false) external access to the database by this user.",
  }),
};
