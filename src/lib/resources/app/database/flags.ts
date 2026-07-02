import { Flags } from "@oclif/core";

export const databasePurposeFlag = Flags.string({
  summary: "the purpose the database serves for the app installation.",
  description:
    "Describes how the app installation uses the linked database. Must be one of 'primary', 'cache' or 'custom'.",
  options: ["primary", "cache", "custom"],
  default: "primary",
  required: true,
});

export const databasePurposeSelectorFlag = Flags.string({
  summary: "the purpose of the linked database to act on.",
  description:
    "Selects which linked database to act on by its purpose ('primary', 'cache' or 'custom'). Only needed when the app installation has more than one linked database.",
  options: ["primary", "cache", "custom"],
  required: false,
});

export const adminUserIdFlag = Flags.string({
  summary: "the ID of the database user to link as the administrative user.",
  description:
    "The ID of the database user that should be used as the administrative ('admin') user for the linked database.",
  required: true,
});
