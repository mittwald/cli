import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { collectEnvironment } from "./env.js";

describe("collectEnvironment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should preserve JSON array strings from env file", async () => {
    // Simulate base environment variables
    const baseEnv = {
      NODE_ENV: "production",
    };

    // Mock .env file path and its content
    const envFilePath = "test.env";
    const envFileContent = `NODES_EXCLUDE=["node1","node2","node3"]\n`;

    // Call `collectEnvironment` with the mocks in effect
    const result = await collectEnvironment(baseEnv, envFilePath);

    // Assertions
    expect(result).toEqual({
      NODE_ENV: "production",
      NODES_EXCLUDE: '["node1","node2","node3"]', // JSON array must remain a string
    });
  });
});
