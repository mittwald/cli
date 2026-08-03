import type { ParsedArg, ParsedFlag } from "./types.js";

export const DEFAULT_UUID = "00000000-0000-4000-8000-000000000000";

export const SHARED_FLAG_SCHEMAS: Record<string, ParsedFlag[]> = {
  processFlags: [
    {
      name: "quiet",
      required: false,
      type: "boolean",
      takesValue: false,
      defaultValue: "false",
    },
  ],
  projectFlags: [
    {
      name: "project-id",
      required: false,
      type: "string",
      takesValue: true,
    },
  ],
  appInstallationFlags: [
    {
      name: "installation-id",
      required: false,
      type: "string",
      takesValue: true,
    },
  ],
  waitFlags: [
    {
      name: "wait",
      required: false,
      type: "boolean",
      takesValue: false,
    },
    {
      name: "wait-timeout",
      required: false,
      type: "string",
      takesValue: true,
      defaultValue: "10m",
    },
  ],
  ddevFlags: [
    {
      name: "override-type",
      required: false,
      type: "string",
      takesValue: true,
      defaultValue: "auto",
      options: ["auto"],
    },
    {
      name: "database-id",
      required: false,
      type: "string",
      takesValue: true,
      exclusive: ["without-database"],
    },
    {
      name: "without-database",
      required: false,
      type: "boolean",
      takesValue: false,
      exclusive: ["database-id"],
    },
  ],
  pathMappingFlags: [
    {
      name: "path-to-app",
      required: false,
      type: "string",
      takesValue: true,
      multiple: true,
    },
    {
      name: "path-to-url",
      required: false,
      type: "string",
      takesValue: true,
      multiple: true,
    },
    {
      name: "path-to-container",
      required: false,
      type: "string",
      takesValue: true,
      multiple: true,
    },
  ],
};

export const SHARED_ARG_SCHEMAS: Record<string, ParsedArg[]> = {
  appInstallationArgs: [
    {
      name: "installation-id",
      required: true,
      placeholderKind: "uuid",
    },
  ],
  backupArgs: [
    {
      name: "backup-id",
      required: true,
      placeholderKind: "uuid",
    },
  ],
  mysqlArgs: [
    {
      name: "database-id",
      required: true,
      placeholderKind: "uuid",
    },
  ],
  redisArgs: [
    {
      name: "database-id",
      required: true,
      placeholderKind: "uuid",
    },
  ],
  dnsZoneArgs: [
    {
      name: "dnszone-id",
      required: true,
      placeholderKind: "generic",
    },
  ],
  conversationArgs: [
    {
      name: "conversation-id",
      required: true,
      placeholderKind: "uuid",
    },
  ],
  orgArgs: [
    {
      name: "org-id",
      required: true,
      placeholderKind: "uuid",
    },
  ],
  domainArgs: [
    {
      name: "domain-id",
      required: true,
      placeholderKind: "generic",
    },
  ],
  mailAddressArgs: [
    {
      name: "mailaddress-id",
      required: true,
      placeholderKind: "generic",
    },
  ],
  mailDeliveryBoxArgs: [
    {
      name: "maildeliverybox-id",
      required: true,
      placeholderKind: "uuid",
    },
  ],
  stackArgs: [
    {
      name: "stack-id",
      required: true,
      placeholderKind: "uuid",
    },
  ],
};

export const NAMED_FLAG_SCHEMAS: Record<string, Omit<ParsedFlag, "name">> = {
  adminUserIdFlag: {
    required: true,
    type: "string",
    takesValue: true,
  },
  databasePurposeFlag: {
    required: true,
    type: "string",
    takesValue: true,
    options: ["primary", "cache", "custom"],
    defaultValue: "primary",
  },
  databasePurposeSelectorFlag: {
    required: false,
    type: "string",
    takesValue: true,
    options: ["primary", "cache", "custom"],
  },
};
