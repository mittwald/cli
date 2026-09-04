import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  type FailureCategory,
  loadClassificationCatalog,
} from "./classification-catalog.js";
import {
  detectInteractiveSignals,
  extractArgsSchema,
  extractExampleCandidate,
  extractFlagsSchema,
} from "./command-discovery/parsing.js";
import {
  resolveProfiles,
  synthesizeInvocation,
} from "./command-discovery/synthesis.js";
import type { DiscoveredCommand } from "./command-discovery/types.js";

export type {
  DiscoveredCommand,
  FlagValueType,
  InteractiveSignal,
  InvocationProfile,
  ParsedArg,
  ParsedFlag,
  PlaceholderKind,
  SynthesizedInvocation,
  ValueSource,
} from "./command-discovery/types.js";

const COMMAND_FILE_EXTENSION_REGEX = /\.(ts|tsx)$/;
const NON_COMMAND_FILE_REGEX = /\.test\.(ts|tsx)$/;

export type DiscoverCommandsOptions = {
  commandsRoot?: string;
  onProgress?: (message: string) => void;
  categoryFilter?: FailureCategory;
  classificationCatalogPath?: string;
};

export async function discoverRunnableCommands(
  options: DiscoverCommandsOptions = {},
): Promise<DiscoveredCommand[]> {
  const commandsRoot =
    options.commandsRoot ?? path.resolve(process.cwd(), "src/commands");
  const onProgress = options.onProgress;
  const categoryFilter = options.categoryFilter;

  const commandFiles = await collectCommandFiles(commandsRoot);
  const discovered: DiscoveredCommand[] = [];

  onProgress?.(
    `[discovery] found ${commandFiles.length} command source files under ${commandsRoot}`,
  );

  for (const [index, filePath] of commandFiles.entries()) {
    const source = await readFile(filePath, "utf8");
    const relativePath = path.relative(commandsRoot, filePath);
    const commandId = toCommandId(relativePath);
    const commandTokens = commandId.split(" ");
    const position = `${index + 1}/${commandFiles.length}`;
    const extractionDiagnostics: string[] = [];
    const profiles = resolveProfiles(commandId);

    onProgress?.(`[discovery:${position}] scanning ${commandId}`);

    const parsedArgs = extractArgsSchema(source, extractionDiagnostics);
    const parsedFlags = extractFlagsSchema(source, extractionDiagnostics);
    const interactiveSignals = detectInteractiveSignals(source);
    const exampleCandidate = profiles.some(
      (profile) => profile.disableExampleSource,
    )
      ? undefined
      : extractExampleCandidate(source, commandId);

    const synthesizedInvocation = synthesizeInvocation({
      commandId,
      commandTokens,
      parsedArgs,
      parsedFlags,
      interactiveSignals,
      exampleCandidate,
      profiles,
    });

    discovered.push({
      commandId,
      sourceFile: relativePath,
      commandTokens,
      parsedArgs,
      parsedFlags,
      interactiveSignals,
      invocationProfilesApplied: profiles.map((profile) => profile.id),
      extractionDiagnostics,
      synthesizedInvocation,
    });

    onProgress?.(
      `[discovery:${position}] ${commandId} -> ${synthesizedInvocation.argumentSource}${synthesizedInvocation.staleExample ? " (stale-example-fallback)" : ""}`,
    );
  }

  const sorted = discovered.sort((a, b) =>
    a.commandId.localeCompare(b.commandId),
  );

  if (!categoryFilter) {
    onProgress?.(`[discovery] completed ${sorted.length} commands`);
    return sorted;
  }

  const classificationCatalog = await loadClassificationCatalog(
    options.classificationCatalogPath,
  );

  const selectedCommandIds = new Set(
    classificationCatalog.entries
      .filter((entry) => entry.category === categoryFilter)
      .map((entry) => entry.commandId),
  );

  const filtered = sorted.filter((command) =>
    selectedCommandIds.has(command.commandId),
  );

  onProgress?.(
    `[discovery] completed ${sorted.length} commands; category filter ${categoryFilter} => ${filtered.length}`,
  );

  return filtered;
}

async function collectCommandFiles(rootDir: string): Promise<string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(rootDir, entry.name);

      if (entry.isDirectory()) {
        return await collectCommandFiles(fullPath);
      }

      if (!entry.isFile()) {
        return [];
      }

      if (!COMMAND_FILE_EXTENSION_REGEX.test(entry.name)) {
        return [];
      }

      if (NON_COMMAND_FILE_REGEX.test(entry.name)) {
        return [];
      }

      return [fullPath];
    }),
  );

  return files.flat();
}

function toCommandId(relativeFilePath: string): string {
  const withoutExtension = relativeFilePath.replace(
    COMMAND_FILE_EXTENSION_REGEX,
    "",
  );
  return withoutExtension.split(path.sep).join(" ");
}
