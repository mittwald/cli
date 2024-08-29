import { Flags } from "@oclif/core";

export const mysqlUserFlagDefinitions = {
  "database-id": Flags.custom<string>({
    required: true,
    description: "ID of the MySQL Database to create a user for",
  }),
  "access-level": Flags.custom<"full" | "readonly">({
    description: "Access level for this MySQL user",
    options: ["readonly", "full"],
  }),
  description: Flags.custom<string>({
    description: "Description of the MySQL user",
  }),
  password: Flags.custom<string>({
    description: "Password used for authentication",
  }),
  "access-ip-mask": Flags.custom<string>({
    description: "IP from wich external access will be exclusively allowed",
  }),
  "external-access": Flags.custom<boolean>({
    description: "Enable/Disable external access for this user.",
  }),
};
