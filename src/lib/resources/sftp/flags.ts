import { Flags } from "@oclif/core";

export const sftpUserFlagDefinitions = {
  description: Flags.custom<string>({
    summary: "Set description for SFTP user.",
    description:
      "Set the description for the given SFTP user, which will be displayed in the mStudio as well as with the list command.",
  }),
  "public-key": Flags.custom<string>({
    summary: "Public key used for authentication",
    description:
      "Specifies the public key to use for authentication. " +
      "The corresponding private key is required locally to connect through this user. " +
      "Using a public key for authentication prevents this user from also using a password for authentication.",
  }),
  password: Flags.custom<string>({
    summary: "Password used for authentication",
    description:
      "Specify an authentication password. " +
      "Using a password for authentication prevents this user from also using a public key for authentication.",
  }),
  "access-level": Flags.custom<string>({
    options: ["read", "full"],
    summary: "Set access level permissions for the SFTP user.",
    description:
      "Must be specified as either read or full. Grant the user either read-only or full file read and write privileges.",
  }),
  directories: Flags.custom<string[]>({
    multiple: true,
    summary: "Specify directories to restrict this SFTP users access to.",
    description:
      "Specified as a list of directories, will restrict access for this user to the specified directories.",
  }),
};
