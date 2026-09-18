import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  buildClassificationCatalogFromBuckets,
  createFailureBuckets,
  FAILURE_CATEGORIES,
  parseFailureCategory,
  saveClassificationCatalog,
} from "./classification-catalog.js";
import { runDevCommand } from "./command.js";
import { discoverRunnableCommands } from "./command-discovery.js";
import type { WaiverCategory } from "./command-discovery/types.js";
import { loadCommandWaivers } from "./config/loader.js";
import {
  configureIntegrationEnv,
  requireIntegrationEnv,
  restoreEnv,
  snapshotEnv,
} from "./env.js";
import { seedProjectContext } from "./run-all-commands/context.js";
import {
  classifyFailure,
  formatNonWaivedFailureSummary,
  logBucketSummary,
  logCommandFailureOutput,
  mapCommandWaivers,
  type NonWaivedFailure,
  validateInvocationCompleteness,
} from "./run-all-commands/helpers.js";
import {
  appendMachineLogEntry,
  initializeMachineLogFile,
} from "./run-all-commands/machine-log.js";
import {
  applyCommandOverride,
  loadRunAllOverrides,
  resolveInvocationArgs,
  shouldBypassWaiverForCommand,
} from "./run-all-commands/overrides.js";

jest.setTimeout(20 * 60 * 1000);

type FailureCategory = WaiverCategory;

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

function logProgress(message: string): void {
  process.stderr.write(`${message}\n`);
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
    const runtimeOverrides = loadRunAllOverrides();

    await initializeMachineLogFile(machineLogPath);
    logProgress(`[run-all] machine log path=${machineLogPath}`);

    const projectId = process.env.MW_TEST_PROJECT_ID!.trim();
    await seedProjectContext(projectId);
    logProgress(
      `[run-all] using context project-id from MW_TEST_PROJECT_ID (${projectId}); MW_CONFIG_DIR=${process.env.MW_CONFIG_DIR}`,
    );

    logProgress("[run-all] starting command discovery");
    const discoveredCommands = await discoverRunnableCommands({
      onProgress: logProgress,
      categoryFilter,
      classificationCatalogPath,
    });

    const commands = applyCommandOverride(discoveredCommands, runtimeOverrides);
    expect(commands.length).toBeGreaterThan(0);

    if (categoryFilter) {
      logProgress(
        `[run-all] category filter active: ${categoryFilter}${classificationCatalogPath ? ` (catalog=${classificationCatalogPath})` : ""}`,
      );
    }

    if (runtimeOverrides.commandId) {
      logProgress(
        `[run-all] command override active: ${runtimeOverrides.commandId}${runtimeOverrides.invocationArgs ? " (custom invocation args)" : ""}`,
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
      runtimeOverrides,
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

    const strictWaiverIntegrityMode =
      !categoryFilter && runtimeOverrides.commandId === undefined;
    const disableWaiversForCategoryFilter = categoryFilter !== undefined;

    if (strictWaiverIntegrityMode) {
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
        "[waivers] strict waiver integrity checks skipped (category filter or command override active)",
      );
    }

    if (disableWaiversForCategoryFilter) {
      logProgress(
        "[waivers] waiver application disabled because MW_TEST_CATEGORY is active",
      );
    }

    for (const [index, command] of commands.entries()) {
      const position = `${index + 1}/${commands.length}`;
      const synthesizedInvocation = command.synthesizedInvocation;
      const effectiveInvocationArgs = resolveInvocationArgs(
        command,
        runtimeOverrides,
      );
      const waiver = waiversByCommandId.get(command.commandId);
      const bypassWaiver =
        disableWaiversForCategoryFilter ||
        shouldBypassWaiverForCommand(command, runtimeOverrides);
      const commandStartedAt = Date.now();

      await seedProjectContext(projectId);
      logProgress(
        `[${position}] running ${command.commandId} (source=${synthesizedInvocation.argumentSource}; interactive=${synthesizedInvocation.interactiveDecision}; re-seeded project context)`,
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
        invocationArgs: effectiveInvocationArgs,
        synthesizedInvocationArgs: synthesizedInvocation.args,
        argumentSource: synthesizedInvocation.argumentSource,
        interactiveDecision: synthesizedInvocation.interactiveDecision,
        overrideApplied: effectiveInvocationArgs !== synthesizedInvocation.args,
      });

      if (waiver && !bypassWaiver) {
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

      if (waiver && bypassWaiver) {
        const bypassReason = disableWaiversForCategoryFilter
          ? "category filter active"
          : "command override";
        logProgress(
          `[${position}] waiver bypass ${command.commandId} (category=${waiver.category}; reason=${waiver.reason}; bypass=${bypassReason})`,
        );
      }

      if (
        synthesizedInvocation.interactiveDecision === "INTERACTIVE_REQUIRED" &&
        !bypassWaiver
      ) {
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

      const staticInvocationIssues = validateInvocationCompleteness(
        command,
        effectiveInvocationArgs,
      );
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

      const result = await runDevCommand(effectiveInvocationArgs, {
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
        logCommandFailureOutput(position, command.commandId, result, logProgress);
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
          `${command.commandId} failed to execute (source=${synthesizedInvocation.argumentSource}): ${errorMessage}`,
        );
        logProgress(
          `[${position}] spawn-error ${command.commandId}: ${errorMessage}`,
        );
        logCommandFailureOutput(position, command.commandId, result, logProgress);
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
        logCommandFailureOutput(position, command.commandId, result, logProgress);

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
    logBucketSummary(
      "[run-all] failure taxonomy summary:",
      FAILURE_CATEGORIES,
      failuresByCategory,
      logProgress,
    );
    logBucketSummary(
      "[run-all] waiver summary:",
      FAILURE_CATEGORIES,
      waivedByCategory,
      logProgress,
    );

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
      runtimeOverrides,
    });

    if (!categoryFilter && !runtimeOverrides.commandId) {
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
        "[run-all] skipped classification catalog write (category filter or command override active)",
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
