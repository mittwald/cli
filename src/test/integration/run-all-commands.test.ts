import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { appendFile, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  buildClassificationCatalogFromBuckets,
  parseFailureCategory,
  saveClassificationCatalog,
} from "./classification-catalog.js";
import { runDevCommand } from "./command.js";
import { discoverRunnableCommands } from "./command-discovery.js";
import type {
  CommandWaiver,
  WaiverCategory,
} from "./command-discovery/types.js";
import { loadCommandWaivers } from "./config/loader.js";
import {
  configureIntegrationEnv,
  requireIntegrationEnv,
  restoreEnv,
  snapshotEnv,
} from "./env.js";

jest.setTimeout(20 * 60 * 1000);

type FailureCategory = WaiverCategory;

type MachineLogEntry = Record<string, unknown>;

type NonWaivedFailure = {
  commandId: string;
  kind: "failure" | "spawn-error";
  category?: FailureCategory;
  details: string;
};

const FAILURE_CATEGORIES: FailureCategory[] = [
  "ARG_MISUSE",
  "INTERACTIVE_REQUIRED",
  "RESOURCE_PRECONDITION",
  "CONTRACT_SHAPE",
  "COMMAND_BUG",
  "DEPRECATED_ENDPOINT",
];

function isExplicitRunByPathInvocationForThisFile(): boolean {
  const args = process.argv.slice(2);
  const runTestsByPathArgs = new Set<string>();
  const targetRelativePath = path
    .normalize("src/test/integration/run-all-commands.test.ts")
    .replaceAll("\\", "/");

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--runTestsByPath") {
      const maybePath = args[i + 1];
      if (maybePath && !maybePath.startsWith("--")) {
        runTestsByPathArgs.add(path.normalize(maybePath));
      }
      continue;
    }

    if (arg.startsWith("--runTestsByPath=")) {
      const maybePath = arg.slice("--runTestsByPath=".length);
      if (maybePath) {
        runTestsByPathArgs.add(path.normalize(maybePath));
      }
    }
  }

  if (runTestsByPathArgs.size === 0) {
    return false;
  }

  return Array.from(runTestsByPathArgs).some((candidate) => {
    const normalizedCandidate = candidate.replaceAll("\\", "/");
    return (
      normalizedCandidate === targetRelativePath ||
      normalizedCandidate.endsWith(`/${targetRelativePath}`)
    );
  });
}

const describeRunAllCommands = isExplicitRunByPathInvocationForThisFile()
  ? describe
  : describe.skip;

function createFailureBuckets(): Record<FailureCategory, string[]> {
  return {
    ARG_MISUSE: [],
    INTERACTIVE_REQUIRED: [],
    RESOURCE_PRECONDITION: [],
    CONTRACT_SHAPE: [],
    COMMAND_BUG: [],
    DEPRECATED_ENDPOINT: [],
  };
}

function classifyFailure(output: {
  stderr: string;
  stdout: string;
}): FailureCategory {
  const text = `${output.stderr}\n${output.stdout}`.toLowerCase();

  if (
    /missing\s+(?:\d+\s+)?required arg|missing\s+(?:\d+\s+)?required flag|exactly one of|required options|unexpected argument|unknown flag|nonexistent flag|invalid flag|flag .* expects|no .* id given|you need to specify at least one/i.test(
      text,
    )
  ) {
    return "ARG_MISUSE";
  }

  if (
    /prompt|interactive|addinput|addselect|addconfirmation|overwrite\?|token file already exists|tty/i.test(
      text,
    )
  ) {
    return "INTERACTIVE_REQUIRED";
  }

  if (
    /not found|does not exist|no .* found|resource.*missing|404|forbidden|unauthorized|no project found|failed to connect|could not resolve hostname|name or service not known|no main user found|main mysql user can not be deleted manually/i.test(
      text,
    )
  ) {
    return "RESOURCE_PRECONDITION";
  }

  if (
    /invalid version|not iterable|cannot read properties|undefined.*data|validation|invalid type|schema/i.test(
      text,
    )
  ) {
    return "CONTRACT_SHAPE";
  }

  return "COMMAND_BUG";
}

function parseInvocationPartsFromArgs(
  args: string[],
  commandTokenCount: number,
): { positionalValues: string[]; flagValues: Map<string, string[]> } {
  const positionalValues: string[] = [];
  const flagValues = new Map<string, string[]>();

  const invocationArgs = args.slice(commandTokenCount);
  for (let i = 0; i < invocationArgs.length; i += 1) {
    const token = invocationArgs[i];
    if (!token.startsWith("--")) {
      positionalValues.push(token);
      continue;
    }

    const withoutPrefix = token.slice(2);
    const eqIndex = withoutPrefix.indexOf("=");
    let name = withoutPrefix;
    let value: string | undefined;

    if (eqIndex >= 0) {
      name = withoutPrefix.slice(0, eqIndex);
      value = withoutPrefix.slice(eqIndex + 1);
    } else {
      const nextToken = invocationArgs[i + 1];
      if (nextToken && !nextToken.startsWith("--")) {
        value = nextToken;
        i += 1;
      }
    }

    const values = flagValues.get(name) ?? [];
    values.push(value ?? "true");
    flagValues.set(name, values);
  }

  return { positionalValues, flagValues };
}

function validateInvocationCompleteness(
  command: Awaited<ReturnType<typeof discoverRunnableCommands>>[number],
): string[] {
  const issues: string[] = [];
  const { positionalValues, flagValues } = parseInvocationPartsFromArgs(
    command.synthesizedInvocation.args,
    command.commandTokens.length,
  );

  command.parsedArgs.forEach((arg, index) => {
    if (!arg.required) {
      return;
    }
    if (positionalValues[index] === undefined) {
      issues.push(`missing required arg ${arg.name}`);
    }
  });

  for (const flag of command.parsedFlags) {
    if (flag.required && !flagValues.has(flag.name)) {
      issues.push(`missing required flag --${flag.name}`);
    }
  }

  const exactlyOneGroups = new Map<string, string[]>();
  for (const flag of command.parsedFlags) {
    if (!flag.exactlyOne || flag.exactlyOne.length < 2) {
      continue;
    }
    const members = [...new Set(flag.exactlyOne)].sort();
    exactlyOneGroups.set(members.join("|"), members);
  }

  for (const members of exactlyOneGroups.values()) {
    const selected = members.filter((member) => flagValues.has(member));
    if (selected.length !== 1) {
      issues.push(`exactly-one unresolved [${members.join(",")}]`);
    }
  }

  return issues;
}

function logFailureTaxonomySummary(
  failuresByCategory: Record<FailureCategory, string[]>,
): void {
  logProgress("[run-all] failure taxonomy summary:");

  for (const category of FAILURE_CATEGORIES) {
    const commands = failuresByCategory[category];
    const sample = commands.slice(0, 5).join(", ");
    logProgress(
      `[run-all]   ${category.padEnd(22, " ")} count=${String(commands.length).padStart(3, " ")} sample=${sample || "-"}`,
    );
  }
}

function mapCommandWaivers(waivers: CommandWaiver[]): {
  waiversByCommandId: Map<string, CommandWaiver>;
  duplicates: string[];
} {
  const waiversByCommandId = new Map<string, CommandWaiver>();
  const duplicates: string[] = [];

  for (const waiver of waivers) {
    if (waiversByCommandId.has(waiver.commandId)) {
      duplicates.push(waiver.commandId);
      continue;
    }

    waiversByCommandId.set(waiver.commandId, waiver);
  }

  return { waiversByCommandId, duplicates };
}

function logWaiverSummary(
  waivedByCategory: Record<FailureCategory, string[]>,
): void {
  logProgress("[run-all] waiver summary:");

  for (const category of FAILURE_CATEGORIES) {
    const commands = waivedByCategory[category];
    const sample = commands.slice(0, 5).join(", ");
    logProgress(
      `[run-all]   ${category.padEnd(22, " ")} count=${String(commands.length).padStart(3, " ")} sample=${sample || "-"}`,
    );
  }
}

function logProgress(message: string): void {
  process.stderr.write(`${message}\n`);
}

function formatNonWaivedFailureSummary(failures: NonWaivedFailure[]): string {
  if (failures.length === 0) {
    return "<none>";
  }

  return failures
    .map((failure) => {
      const base =
        failure.kind === "failure"
          ? `${failure.commandId} [${failure.category}]`
          : `${failure.commandId} [spawn-error]`;
      return `${base}: ${failure.details}`;
    })
    .join("\n");
}

function formatOutputBlock(output: string): string {
  const trimmed = output.trim();
  return trimmed.length > 0 ? trimmed : "<empty>";
}

function logCommandFailureOutput(
  position: string,
  commandId: string,
  result: { stdout: string; stderr: string },
): void {
  logProgress(`[${position}] diagnostics ${commandId}: stderr >>>`);
  logProgress(formatOutputBlock(result.stderr));
  logProgress(`[${position}] diagnostics ${commandId}: stdout >>>`);
  logProgress(formatOutputBlock(result.stdout));
  logProgress(`[${position}] diagnostics ${commandId}: <<<`);
}

async function initializeMachineLogFile(filePath: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, "", "utf-8");
}

async function appendMachineLogEntry(
  filePath: string,
  entry: MachineLogEntry,
): Promise<void> {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...entry,
  });
  await appendFile(filePath, `${line}\n`, "utf-8");
}

async function seedProjectContext(projectId: string): Promise<void> {
  const configDir = process.env.MW_CONFIG_DIR;

  if (!configDir) {
    throw new Error(
      "[integration:run-all-commands] MW_CONFIG_DIR was not set before seeding project context.",
    );
  }

  const contextFile = path.join(configDir, "context.json");

  await mkdir(configDir, { recursive: true });
  await writeFile(
    contextFile,
    JSON.stringify({
      "project-id": projectId,
      "server-id": "6b4f48f5-d80c-4d20-9db8-fecf4c9e6221",
      "installation-id": "f7b47c12-7d11-4f3a-b9bc-1b3c706e1d55",
      "org-id": "88e8d927-7db4-42ef-ae02-f8a7ef0b4d77",
    }),
    "utf-8",
  );
}

describeRunAllCommands("integration: run all commands", () => {
  let originalEnv: NodeJS.ProcessEnv;
  let tempConfigDir: string;

  beforeEach(async () => {
    originalEnv = snapshotEnv();
    tempConfigDir = await mkdtemp(path.join(tmpdir(), "mw-int-config-"));
    process.env.MW_CONFIG_DIR = tempConfigDir;
  });

  afterEach(async () => {
    restoreEnv(originalEnv);
    await rm(tempConfigDir, { recursive: true, force: true });
  });

  it("discovers and executes every command once", async () => {
    configureIntegrationEnv("run-all-commands");
    requireIntegrationEnv(["MW_TEST_PROJECT_ID"], "run-all-commands");

    const categoryFilterRaw = process.env.MW_TEST_CATEGORY?.trim();
    const categoryFilter = categoryFilterRaw
      ? parseFailureCategory(categoryFilterRaw)
      : undefined;
    const classificationCatalogPath =
      process.env.MW_TEST_CLASSIFICATION_CATALOG_PATH?.trim() || undefined;
    const machineLogPath =
      process.env.MW_TEST_MACHINE_LOG_PATH?.trim() ||
      path.resolve("run-all-commands.ndjson");

    await initializeMachineLogFile(machineLogPath);
    logProgress(`[run-all] machine log path=${machineLogPath}`);

    const projectId = process.env.MW_TEST_PROJECT_ID!.trim();
    await seedProjectContext(projectId);
    logProgress(
      `[run-all] using context project-id from MW_TEST_PROJECT_ID (${projectId}); MW_CONFIG_DIR=${process.env.MW_CONFIG_DIR}`,
    );

    logProgress("[run-all] starting command discovery");
    const commands = await discoverRunnableCommands({
      onProgress: logProgress,
      categoryFilter,
      classificationCatalogPath,
    });
    expect(commands.length).toBeGreaterThan(0);

    if (categoryFilter) {
      logProgress(
        `[run-all] category filter active: ${categoryFilter}${classificationCatalogPath ? ` (catalog=${classificationCatalogPath})` : ""}`,
      );
    }

    const waivers = loadCommandWaivers();
    const { waiversByCommandId, duplicates } = mapCommandWaivers(waivers);

    await appendMachineLogEntry(machineLogPath, {
      event: "run-start",
      categoryFilter: categoryFilter ?? null,
      classificationCatalogPath: classificationCatalogPath ?? null,
      projectId,
      commandCount: commands.length,
      waiverCount: waivers.length,
    });

    logProgress(`[run-all] discovered ${commands.length} commands to execute`);
    logProgress(`[run-all] loaded ${waivers.length} waiver entries`);

    const staleExampleCommands = commands.filter(
      (command) => command.synthesizedInvocation.staleExample,
    );
    const extractionDiagnostics = commands.flatMap(
      (command) => command.extractionDiagnostics,
    ).length;
    logProgress(
      `[run-all] stale examples detected=${staleExampleCommands.length}; extraction diagnostics=${extractionDiagnostics}`,
    );

    const infrastructureFailures: string[] = [];
    const failuresByCategory = createFailureBuckets();
    const waivedByCategory = createFailureBuckets();
    const nonWaivedFailures: NonWaivedFailure[] = [];
    let successfulCommands = 0;
    let failedCommands = 0;
    let waivedSkippedCommands = 0;

    if (!categoryFilter) {
      if (duplicates.length > 0) {
        infrastructureFailures.push(
          `[waivers] duplicate waiver commandId entries: ${duplicates.join(", ")}`,
        );
      }

      const discoveredCommandIds = new Set(
        commands.map((command) => command.commandId),
      );
      for (const waiver of waivers) {
        if (!discoveredCommandIds.has(waiver.commandId)) {
          infrastructureFailures.push(
            `[waivers] command '${waiver.commandId}' has a waiver but is not part of current discovery output`,
          );
        }
      }
    } else {
      logProgress(
        "[waivers] strict waiver integrity checks skipped (category filter active)",
      );
    }

    for (const [index, command] of commands.entries()) {
      const position = `${index + 1}/${commands.length}`;
      const invocation = command.synthesizedInvocation;
      const waiver = waiversByCommandId.get(command.commandId);
      const commandStartedAt = Date.now();

      await seedProjectContext(projectId);
      logProgress(
        `[${position}] running ${command.commandId} (source=${invocation.argumentSource}; interactive=${invocation.interactiveDecision}; re-seeded project context)`,
      );

      await appendMachineLogEntry(machineLogPath, {
        event: "command-start",
        index: index + 1,
        total: commands.length,
        position,
        commandId: command.commandId,
        sourceFile: command.sourceFile,
        commandTokens: command.commandTokens,
        parsedArgs: command.parsedArgs,
        parsedFlags: command.parsedFlags,
        interactiveSignals: command.interactiveSignals,
        invocationProfilesApplied: command.invocationProfilesApplied,
        extractionDiagnostics: command.extractionDiagnostics,
        invocationArgs: invocation.args,
        argumentSource: invocation.argumentSource,
        interactiveDecision: invocation.interactiveDecision,
      });

      if (waiver) {
        waivedSkippedCommands += 1;
        waivedByCategory[waiver.category].push(command.commandId);
        logProgress(
          `[${position}] waived ${command.commandId} (category=${waiver.category}; reason=${waiver.reason}${waiver.issue ? `; issue=${waiver.issue}` : ""})`,
        );
        await appendMachineLogEntry(machineLogPath, {
          event: "command-result",
          index: index + 1,
          total: commands.length,
          position,
          commandId: command.commandId,
          status: "waived",
          durationMs: Date.now() - commandStartedAt,
          waiver,
        });
        continue;
      }

      if (invocation.interactiveDecision === "INTERACTIVE_REQUIRED") {
        failedCommands += 1;
        failuresByCategory.INTERACTIVE_REQUIRED.push(command.commandId);
        nonWaivedFailures.push({
          commandId: command.commandId,
          kind: "failure",
          category: "INTERACTIVE_REQUIRED",
          details: "classified INTERACTIVE_REQUIRED but no waiver entry exists",
        });
        infrastructureFailures.push(
          `[waivers] ${command.commandId} was classified INTERACTIVE_REQUIRED but has no waiver entry`,
        );
        logProgress(
          `[${position}] classified ${command.commandId} as INTERACTIVE_REQUIRED (missing waiver entry)`,
        );
        await appendMachineLogEntry(machineLogPath, {
          event: "command-result",
          index: index + 1,
          total: commands.length,
          position,
          commandId: command.commandId,
          status: "failed",
          failureCategory: "INTERACTIVE_REQUIRED",
          durationMs: Date.now() - commandStartedAt,
          details: "classified INTERACTIVE_REQUIRED but no waiver entry exists",
        });
        continue;
      }

      const staticInvocationIssues = validateInvocationCompleteness(command);
      if (staticInvocationIssues.length > 0) {
        failedCommands += 1;
        failuresByCategory.ARG_MISUSE.push(command.commandId);
        nonWaivedFailures.push({
          commandId: command.commandId,
          kind: "failure",
          category: "ARG_MISUSE",
          details: staticInvocationIssues.join("; "),
        });
        logProgress(
          `[${position}] preflight ${command.commandId} classified as ARG_MISUSE (${staticInvocationIssues.join("; ")})`,
        );
        await appendMachineLogEntry(machineLogPath, {
          event: "command-result",
          index: index + 1,
          total: commands.length,
          position,
          commandId: command.commandId,
          status: "failed",
          failureCategory: "ARG_MISUSE",
          durationMs: Date.now() - commandStartedAt,
          preflightIssues: staticInvocationIssues,
        });
        continue;
      }

      const result = await runDevCommand(invocation.args, {
        timeoutMs: 30_000,
      });

      if (result.timedOut) {
        failedCommands += 1;
        failuresByCategory.COMMAND_BUG.push(command.commandId);
        nonWaivedFailures.push({
          commandId: command.commandId,
          kind: "failure",
          category: "COMMAND_BUG",
          details: "timed out after 30000ms",
        });
        logProgress(`[${position}] timeout ${command.commandId}`);
        logCommandFailureOutput(position, command.commandId, result);
        await appendMachineLogEntry(machineLogPath, {
          event: "command-result",
          index: index + 1,
          total: commands.length,
          position,
          commandId: command.commandId,
          status: "failed",
          failureCategory: "COMMAND_BUG",
          durationMs: Date.now() - commandStartedAt,
          timedOut: true,
          stdout: result.stdout,
          stderr: result.stderr,
        });
        continue;
      }

      if (result.exitCode === null) {
        failedCommands += 1;
        const errorMessage = result.error?.message ?? "unknown error";
        nonWaivedFailures.push({
          commandId: command.commandId,
          kind: "spawn-error",
          details: errorMessage,
        });
        infrastructureFailures.push(
          `${command.commandId} failed to execute (source=${invocation.argumentSource}): ${errorMessage}`,
        );
        logProgress(
          `[${position}] spawn-error ${command.commandId}: ${errorMessage}`,
        );
        logCommandFailureOutput(position, command.commandId, result);
        await appendMachineLogEntry(machineLogPath, {
          event: "command-result",
          index: index + 1,
          total: commands.length,
          position,
          commandId: command.commandId,
          status: "spawn-error",
          durationMs: Date.now() - commandStartedAt,
          errorMessage: result.error?.message ?? "unknown error",
          stdout: result.stdout,
          stderr: result.stderr,
        });
        continue;
      }

      if (result.exitCode !== 0) {
        failedCommands += 1;
        const category = classifyFailure(result);
        failuresByCategory[category].push(command.commandId);
        nonWaivedFailures.push({
          commandId: command.commandId,
          kind: "failure",
          category,
          details: `exitCode=${result.exitCode}`,
        });
        logProgress(
          `[${position}] classified ${command.commandId} as ${category}`,
        );
        logCommandFailureOutput(position, command.commandId, result);

        await appendMachineLogEntry(machineLogPath, {
          event: "command-result",
          index: index + 1,
          total: commands.length,
          position,
          commandId: command.commandId,
          status: "failed",
          failureCategory: category,
          durationMs: Date.now() - commandStartedAt,
          exitCode: result.exitCode,
          stdout: result.stdout,
          stderr: result.stderr,
        });
      } else {
        successfulCommands += 1;

        await appendMachineLogEntry(machineLogPath, {
          event: "command-result",
          index: index + 1,
          total: commands.length,
          position,
          commandId: command.commandId,
          status: "succeeded",
          durationMs: Date.now() - commandStartedAt,
          exitCode: result.exitCode,
        });
      }

      logProgress(
        `[${position}] finished ${command.commandId} (exitCode=${result.exitCode})`,
      );
    }

    logProgress(`[run-all] execution complete: ${commands.length} run`);
    logProgress(
      `[run-all] statistics: successful=${successfulCommands}, failed=${failedCommands}, waived-skipped=${waivedSkippedCommands}, total=${commands.length}`,
    );
    logFailureTaxonomySummary(failuresByCategory);
    logWaiverSummary(waivedByCategory);

    await appendMachineLogEntry(machineLogPath, {
      event: "run-summary",
      statistics: {
        successful: successfulCommands,
        failed: failedCommands,
        waivedSkipped: waivedSkippedCommands,
        total: commands.length,
      },
      failuresByCategory,
      waivedByCategory,
      infrastructureFailures,
    });

    if (!categoryFilter) {
      const classificationCatalog = buildClassificationCatalogFromBuckets({
        failuresByCategory,
        waivedByCategory,
        statistics: {
          successful: successfulCommands,
          failed: failedCommands,
          waivedSkipped: waivedSkippedCommands,
          total: commands.length,
        },
      });

      await saveClassificationCatalog(classificationCatalog);
      logProgress(
        `[run-all] wrote classification catalog with ${classificationCatalog.entries.length} entries`,
      );
    } else {
      logProgress(
        "[run-all] skipped classification catalog write (category filter active)",
      );
    }

    expect(infrastructureFailures).toEqual([]);

    if (nonWaivedFailures.length > 0) {
      throw new Error(
        [
          "[run-all] non-waived command failures detected:",
          formatNonWaivedFailureSummary(nonWaivedFailures),
        ].join("\n"),
      );
    }
  });
});
