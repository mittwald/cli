import { Flags } from "@oclif/core";

export const sshConnectionFlags = {
  "ssh-user": Flags.string({
    description:
      "override the SSH user to connect with; if omitted, your own user will be used",
    required: false,
    default: undefined,
    env: "MITTWALD_SSH_USER",
  }),
};
