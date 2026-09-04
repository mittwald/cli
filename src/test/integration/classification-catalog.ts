import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { WaiverCategory } from "./command-discovery/types.js";

export type FailureCategory = WaiverCategory;

export type ClassificationEntrySource = "failure" | "waiver" | "skip";

export type CommandClassificationEntry = {
  commandId: string;
  category: FailureCategory;
  source: ClassificationEntrySource;
};

export type CommandClassificationCatalog = {
  schemaVersion: 1;
  generatedAt: string;
  source: {
    kind: "run-all-summary" | "log-extract";
    path?: string;
  };
  statistics: {
    successful: number;
    failed: number;
    waivedSkipped: number;
    total: number;
  };
  entries: CommandClassificationEntry[];
};

export const FAILURE_CATEGORIES: FailureCategory[] = [
  "ARG_MISUSE",
  "INTERACTIVE_REQUIRED",
  "RESOURCE_PRECONDITION",
  "CONTRACT_SHAPE",
  "COMMAND_BUG",
  "DEPRECATED_ENDPOINT",
];

export function isFailureCategory(value: string): value is FailureCategory {
  return FAILURE_CATEGORIES.includes(value as FailureCategory);
}

export function parseFailureCategory(value: string): FailureCategory {
  if (!isFailureCategory(value)) {
    throw new Error(
      `Invalid category '${value}'. Allowed categories: ${FAILURE_CATEGORIES.join(", ")}`,
    );
  }

  return value;
}

export function createFailureBuckets(): Record<FailureCategory, string[]> {
  return {
    ARG_MISUSE: [],
    INTERACTIVE_REQUIRED: [],
    RESOURCE_PRECONDITION: [],
    CONTRACT_SHAPE: [],
    COMMAND_BUG: [],
    DEPRECATED_ENDPOINT: [],
  };
}

export function getDefaultClassificationCatalogPath(): string {
  return path.resolve(
    process.cwd(),
    "src/test/integration/config/command-classifications.json",
  );
}

export async function loadClassificationCatalog(
  catalogPath = getDefaultClassificationCatalogPath(),
): Promise<CommandClassificationCatalog> {
  const raw = await readFile(catalogPath, "utf8");
  const parsed = JSON.parse(raw) as CommandClassificationCatalog;
  return parsed;
}

export async function saveClassificationCatalog(
  catalog: CommandClassificationCatalog,
  catalogPath = getDefaultClassificationCatalogPath(),
): Promise<void> {
  await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}

export function buildClassificationCatalogFromBuckets(input: {
  failuresByCategory: Record<FailureCategory, string[]>;
  waivedByCategory: Record<FailureCategory, string[]>;
  statistics: {
    successful: number;
    failed: number;
    waivedSkipped: number;
    total: number;
  };
  generatedAt?: string;
}): CommandClassificationCatalog {
  const entryMap = new Map<string, CommandClassificationEntry>();

  for (const category of FAILURE_CATEGORIES) {
    for (const commandId of input.failuresByCategory[category]) {
      entryMap.set(commandId, {
        commandId,
        category,
        source: "failure",
      });
    }
  }

  for (const category of FAILURE_CATEGORIES) {
    for (const commandId of input.waivedByCategory[category]) {
      if (entryMap.has(commandId)) {
        continue;
      }

      entryMap.set(commandId, {
        commandId,
        category,
        source: "waiver",
      });
    }
  }

  return {
    schemaVersion: 1,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    source: {
      kind: "run-all-summary",
    },
    statistics: input.statistics,
    entries: [...entryMap.values()].sort((a, b) =>
      a.commandId.localeCompare(b.commandId),
    ),
  };
}

export function extractClassificationCatalogFromRunLog(input: {
  logContent: string;
  logPath?: string;
}): CommandClassificationCatalog {
  const entryMap = new Map<string, CommandClassificationEntry>();

  const classifiedRegex =
    /^\[(\d+)\/(\d+)\] classified (.+) as (ARG_MISUSE|INTERACTIVE_REQUIRED|RESOURCE_PRECONDITION|CONTRACT_SHAPE|COMMAND_BUG|DEPRECATED_ENDPOINT)$/m;
  const waivedRegex =
    /^\[(\d+)\/(\d+)\] waived (.+) \(category=(ARG_MISUSE|INTERACTIVE_REQUIRED|RESOURCE_PRECONDITION|CONTRACT_SHAPE|COMMAND_BUG|DEPRECATED_ENDPOINT)(?:;|\))/m;
  const skippedInteractiveRegex =
    /^\[(\d+)\/(\d+)\] skipped (.+) \(interactive required\)$/m;

  for (const line of input.logContent.split(/\r?\n/)) {
    const classified = line.match(classifiedRegex);
    if (classified) {
      const commandId = classified[3].trim();
      const category = classified[4] as FailureCategory;
      entryMap.set(commandId, {
        commandId,
        category,
        source: "failure",
      });
      continue;
    }

    const waived = line.match(waivedRegex);
    if (waived) {
      const commandId = waived[3].trim();
      const category = waived[4] as FailureCategory;
      entryMap.set(commandId, {
        commandId,
        category,
        source: "waiver",
      });
      continue;
    }

    const skippedInteractive = line.match(skippedInteractiveRegex);
    if (skippedInteractive) {
      const commandId = skippedInteractive[3].trim();
      entryMap.set(commandId, {
        commandId,
        category: "INTERACTIVE_REQUIRED",
        source: "skip",
      });
    }
  }

  const stats = parseStatistics(input.logContent);

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      kind: "log-extract",
      path: input.logPath,
    },
    statistics: stats,
    entries: [...entryMap.values()].sort((a, b) =>
      a.commandId.localeCompare(b.commandId),
    ),
  };
}

function parseStatistics(logContent: string): {
  successful: number;
  failed: number;
  waivedSkipped: number;
  total: number;
} {
  const statsRegex =
    /\[run-all\] statistics: successful=(\d+), failed=(\d+), (?:waived-skipped|interactive-skipped)=(\d+), total=(\d+)/;

  const match = logContent.match(statsRegex);
  if (!match) {
    return {
      successful: 0,
      failed: 0,
      waivedSkipped: 0,
      total: 0,
    };
  }

  return {
    successful: Number.parseInt(match[1], 10),
    failed: Number.parseInt(match[2], 10),
    waivedSkipped: Number.parseInt(match[3], 10),
    total: Number.parseInt(match[4], 10),
  };
}
