import { describe, expect, it } from "@jest/globals";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_UUID } from "./config.js";
import {
  detectInteractiveSignals,
  extractArgsSchema,
  extractExampleCandidate,
  extractFlagsSchema,
} from "./parsing.js";
import { resolveProfiles, synthesizeInvocation } from "./synthesis.js";

describe("explicit stack invocation profiles", () => {
  it.each([
    ["container run", "container/run.tsx"],
    ["volume create", "volume/create.tsx"],
    ["volume delete", "volume/delete.tsx"],
    ["stack ps", "stack/ps.ts"],
    ["stack template install", "stack/template/install.tsx"],
  ])("supplies a stack ID for %s", async (commandId, sourceFile) => {
    const source = await readFile(
      path.resolve("src/commands", sourceFile),
      "utf8",
    );
    const diagnostics: string[] = [];
    const invocation = synthesizeInvocation({
      commandId,
      commandTokens: commandId.split(" "),
      parsedArgs: extractArgsSchema(source, diagnostics),
      parsedFlags: extractFlagsSchema(source, diagnostics),
      interactiveSignals: detectInteractiveSignals(source),
      exampleCandidate: extractExampleCandidate(source, commandId),
      profiles: resolveProfiles(commandId),
    });

    expect(diagnostics).not.toContain("flags: unresolved spread 'stackFlags'");
    const stackFlagIndex = invocation.args.indexOf("--stack-id");
    expect(stackFlagIndex).toBeGreaterThanOrEqual(0);
    expect(invocation.args[stackFlagIndex + 1]).toBe(DEFAULT_UUID);

    if (commandId === "volume create") {
      const projectFlagIndex = invocation.args.indexOf("--project-id");
      expect(projectFlagIndex).toBeGreaterThanOrEqual(0);
      expect(invocation.args[projectFlagIndex + 1]).toBe(DEFAULT_UUID);
    }
  });
});