import { Flags } from "@oclif/core";

export const sftpUserFlagDefinitions = {
  description: Flags.custom<string>({
    summary: "Description of SFTP user",
  }),
  "public-key": Flags.custom<string>({
    summary: "Public Key used for authentication",
  }),
  password: Flags.custom<string>({
    summary: "Password used for authentication",
  }),
  "access-level": Flags.custom<string>({
    description: "Set access level privileges for the SFTP user",
    options: ["read", "full"],
  }),
  directories: Flags.custom<string[]>({
    description: "Set directories to restrict the SFTP users access to",
    multiple: true,
  }),
};
