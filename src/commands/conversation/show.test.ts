import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { runDevCommand } from "../../test/integration/command.js";
import {
  configureIntegrationEnv,
  restoreEnv,
  snapshotEnv,
} from "../../test/integration/env.js";

function normalizeOutput(output: string): string {
  return output
    .replace(/\u001b\[[0-9;]*m/g, "")
    .replace(/\r/g, "")
    .trim();
}

describe("conversation:show", () => {
  const fallbackConversationId = "186f8f22-aa0f-42bf-909d-757cb9d27b04";

  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = snapshotEnv();
    configureIntegrationEnv("conversation:show");
  });

  afterEach(() => {
    restoreEnv(originalEnv);
  });

  it("shows a conversation and its messages", async () => {
    const conversationId =
      process.env["MW_TEST_CONVERSATION_ID"] ?? fallbackConversationId;

    const { stdout, stderr, error, timedOut } = await runDevCommand(
      ["conversation", "show", conversationId],
      {
        timeoutMs: 25_000,
      },
    );

    expect(timedOut).toBeFalsy();

    expect(error).toBeUndefined();

    const output = normalizeOutput(`${stdout}\n${stderr}`);

    expect(output).toContain("Conversation metadata");
    expect(output).toContain("Messages");
    expect(output).toMatch(/ID\s+\S+/);
    expect(output).toMatch(/Status\s+\S+/i);
  }, 30_000);
});
