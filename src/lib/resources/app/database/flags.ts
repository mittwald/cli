import { Flags } from "@oclif/core";

export const databasePurposeFlag = Flags.string({
  summary: "the purpose the database serves for the app installation.",
  description:
    "Describes how the app installation uses the linked database. Must be one of 'primary', 'cache' or 'custom'.",
  options: ["primary", "cache", "custom"],
  default: "primary",
  required: true,
});

export const adminUserIdFlag = Flags.string({
  summary: "the ID of the database user to link as the administrative user.",
  description:
    "The ID of the database user that should be used as the administrative ('admin') user for the linked database. This is required by the API even though it is not marked as such in the API schema.",
  required: true,
});
