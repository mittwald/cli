import { Flags } from "@oclif/core";

export const sshConnectionFlags = {
  "ssh-user": Flags.string({
    summary:
      "override the SSH user to connect with; if omitted, your own user will be used",
    description:
      "This flag can be used to override the SSH user that is used for a " +
      "connection; be default, your own personal user will be used for this." +
      "\n\n" +
      "You can also set this value by setting the MITTWALD_SSH_USER environment variable.",
    required: false,
    default: undefined,
    env: "MITTWALD_SSH_USER",
    helpGroup: "SSH connection",
  }),
  "ssh-identity-file": Flags.file({
    summary:
      "the SSH identity file (private key) to use for public key authentication.",
    description:
      "The SSH identity file to use for the connection. This file should contain an SSH private key and will be used to authenticate the connection to the server." +
      "\n\n" +
      "You can also set this value by setting the MITTWALD_SSH_IDENTITY_FILE environment variable.",
    required: false,
    default: undefined,
    env: "MITTWALD_SSH_IDENTITY_FILE",
    helpGroup: "SSH connection",
  }),
} as const;

export type SSHConnectionFlags = {
  "ssh-user": string | undefined;
  "ssh-identity-file": string | undefined;
};

export const sshUserFlagDefinitions = {
  description: Flags.custom<string>({
    summary: "Set description for SSH user.",
    description:
      "Set the description for the given SSH user, which will be displayed in the mStudio as well as with the list command.",
  }),
  "public-key": Flags.custom<string>({
    exactlyOne: ["public-key", "password"],
    summary: "Public key used for authentication",
    description:
      "Specifies the public key to use for authentication. " +
      "The corresponding private key is required locally to connect through this user. " +
      "Using a public key for authentication prevents this user from also using a password for authentication.",
  }),
  password: Flags.custom<string>({
    exactlyOne: ["public-key", "password"],
    summary: "Password used for authentication",
    description:
      "Specify an authentication password. " +
      "Using a password for authentication prevents this user from also using a public key for authentication.",
  }),
};
