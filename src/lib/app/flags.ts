import { Args } from "@oclif/core";

export const appInstallationFlags = {
  "installation-id": Args.string({
    description: "ID of the app installation to get",
    required: true,
  }),
};
