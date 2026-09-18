import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  CommandWaiver,
  InvocationProfile,
  WaiverCategory,
} from "../command-discovery/types.js";

const CONFIG_DIR = path.dirname(fileURLToPath(import.meta.url));
const INVOCATION_PROFILES_PATH = path.join(
  CONFIG_DIR,
  "invocation-profiles.json",
);
const COMMAND_WAIVERS_PATH = path.join(CONFIG_DIR, "command-waivers.json");

const WAIVER_CATEGORIES: Set<WaiverCategory> = new Set([
  "ARG_MISUSE",
  "INTERACTIVE_REQUIRED",
  "RESOURCE_PRECONDITION",
  "CONTRACT_SHAPE",
  "COMMAND_BUG",
  "DEPRECATED_ENDPOINT",
]);

let invocationProfilesCache: InvocationProfile[] | undefined;
let commandWaiversCache: CommandWaiver[] | undefined;

export function loadInvocationProfiles(): InvocationProfile[] {
  if (invocationProfilesCache) {
    return invocationProfilesCache;
  }

  const raw = readJsonFile(INVOCATION_PROFILES_PATH, "invocation profiles");
  if (!Array.isArray(raw)) {
    throw new Error(
      "[integration-config] invocation profiles must be an array.",
    );
  }

  invocationProfilesCache = raw.map((value, index) =>
    validateInvocationProfile(value, index),
  );

  return invocationProfilesCache;
}

export function loadCommandWaivers(): CommandWaiver[] {
  if (commandWaiversCache) {
    return commandWaiversCache;
  }

  const raw = readJsonFile(COMMAND_WAIVERS_PATH, "command waivers");
  if (!Array.isArray(raw)) {
    throw new Error("[integration-config] command waivers must be an array.");
  }

  const validated = raw.map((value, index) =>
    validateCommandWaiver(value, index),
  );

  const ids = new Set<string>();
  const commandIds = new Set<string>();
  for (const waiver of validated) {
    if (ids.has(waiver.id)) {
      throw new Error(
        `[integration-config] duplicate waiver id '${waiver.id}'.`,
      );
    }

    if (commandIds.has(waiver.commandId)) {
      throw new Error(
        `[integration-config] duplicate waiver commandId '${waiver.commandId}'.`,
      );
    }

    ids.add(waiver.id);
    commandIds.add(waiver.commandId);
  }

  commandWaiversCache = validated;
  return commandWaiversCache;
}

function readJsonFile(filePath: string, label: string): unknown {
  try {
    const content = readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    throw new Error(
      `[integration-config] failed to load ${label} at ${filePath}: ${(error as Error).message}`,
      { cause: error },
    );
  }
}

function validateInvocationProfile(
  value: unknown,
  index: number,
): InvocationProfile {
  const record = asRecord(value, `invocation profile at index ${index}`);
  const id = asNonEmptyString(record.id, `${profileLabel(index)}.id`);

  const matchRaw = asRecord(record.match, `${profileLabel(index)}.match`);
  const exact = asOptionalString(
    matchRaw.exact,
    `${profileLabel(index)}.match.exact`,
  );
  const prefix = asOptionalString(
    matchRaw.prefix,
    `${profileLabel(index)}.match.prefix`,
  );
  if (!exact && !prefix) {
    throw new Error(
      `[integration-config] ${profileLabel(index)}.match requires 'exact' or 'prefix'.`,
    );
  }

  const requiredFlagDefaults = asOptionalStringBooleanMap(
    record.requiredFlagDefaults,
    `${profileLabel(index)}.requiredFlagDefaults`,
  );
  const requiredArgDefaults = asOptionalStringMap(
    record.requiredArgDefaults,
    `${profileLabel(index)}.requiredArgDefaults`,
  );
  const exactlyOneChoice = asOptionalStringMap(
    record.exactlyOneChoice,
    `${profileLabel(index)}.exactlyOneChoice`,
  );

  const interactivePolicy = asOptionalInteractivePolicy(
    record.interactivePolicy,
    `${profileLabel(index)}.interactivePolicy`,
  );

  const disableExampleSource = asOptionalBoolean(
    record.disableExampleSource,
    `${profileLabel(index)}.disableExampleSource`,
  );

  const notes = asOptionalString(record.notes, `${profileLabel(index)}.notes`);

  return {
    id,
    match: {
      ...(exact ? { exact } : {}),
      ...(prefix ? { prefix } : {}),
    },
    ...(requiredFlagDefaults ? { requiredFlagDefaults } : {}),
    ...(requiredArgDefaults ? { requiredArgDefaults } : {}),
    ...(exactlyOneChoice ? { exactlyOneChoice } : {}),
    ...(interactivePolicy ? { interactivePolicy } : {}),
    ...(disableExampleSource !== undefined ? { disableExampleSource } : {}),
    ...(notes ? { notes } : {}),
  };
}

function validateCommandWaiver(value: unknown, index: number): CommandWaiver {
  const record = asRecord(value, `command waiver at index ${index}`);
  const id = asNonEmptyString(record.id, `${waiverLabel(index)}.id`);
  const commandId = asNonEmptyString(
    record.commandId,
    `${waiverLabel(index)}.commandId`,
  );
  const category = asNonEmptyString(
    record.category,
    `${waiverLabel(index)}.category`,
  ) as WaiverCategory;

  if (!WAIVER_CATEGORIES.has(category)) {
    throw new Error(
      `[integration-config] ${waiverLabel(index)}.category must be one of ${[
        ...WAIVER_CATEGORIES,
      ].join(", ")}.`,
    );
  }

  const reason = asNonEmptyString(
    record.reason,
    `${waiverLabel(index)}.reason`,
  );
  const issue = asOptionalString(record.issue, `${waiverLabel(index)}.issue`);
  const expiresOn = asOptionalString(
    record.expiresOn,
    `${waiverLabel(index)}.expiresOn`,
  );

  return {
    id,
    commandId,
    category,
    reason,
    ...(issue ? { issue } : {}),
    ...(expiresOn ? { expiresOn } : {}),
  };
}

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`[integration-config] ${label} must be an object.`);
  }

  return value as Record<string, unknown>;
}

function asNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `[integration-config] ${label} must be a non-empty string.`,
    );
  }

  return value.trim();
}

function asOptionalString(value: unknown, label: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(
      `[integration-config] ${label} must be a string when provided.`,
    );
  }

  return value;
}

function asOptionalBoolean(value: unknown, label: string): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new Error(
      `[integration-config] ${label} must be a boolean when provided.`,
    );
  }

  return value;
}

function asOptionalInteractivePolicy(
  value: unknown,
  label: string,
): "resolve" | "classify" | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value !== "resolve" && value !== "classify") {
    throw new Error(
      `[integration-config] ${label} must be 'resolve' or 'classify' when provided.`,
    );
  }

  return value;
}

function asOptionalStringMap(
  value: unknown,
  label: string,
): Record<string, string> | undefined {
  if (value === undefined) {
    return undefined;
  }

  const record = asRecord(value, label);
  const result: Record<string, string> = {};
  for (const [key, entry] of Object.entries(record)) {
    if (typeof entry !== "string") {
      throw new Error(`[integration-config] ${label}.${key} must be a string.`);
    }

    result[key] = entry;
  }

  return result;
}

function asOptionalStringBooleanMap(
  value: unknown,
  label: string,
): Record<string, string | boolean> | undefined {
  if (value === undefined) {
    return undefined;
  }

  const record = asRecord(value, label);
  const result: Record<string, string | boolean> = {};

  for (const [key, entry] of Object.entries(record)) {
    if (typeof entry !== "string" && typeof entry !== "boolean") {
      throw new Error(
        `[integration-config] ${label}.${key} must be a string or boolean.`,
      );
    }

    result[key] = entry;
  }

  return result;
}

function profileLabel(index: number): string {
  return `invocation-profiles[${index}]`;
}

function waiverLabel(index: number): string {
  return `command-waivers[${index}]`;
}
