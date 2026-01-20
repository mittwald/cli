import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { collectEnvironment } from "./env.js";

const mockReadFile = jest.fn<typeof import("fs/promises").readFile>();
const mockPathExists = jest.fn<typeof import("../../util/fs/pathExists.js").pathExists>();

jest.unstable_mockModule("fs/promises", () => ({
  readFile: mockReadFile,
}));

jest.unstable_mockModule("../../util/fs/pathExists.js", () => ({
  pathExists: mockPathExists,
}));

describe("collectEnvironment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should preserve JSON array strings from env file", async () => {
    // Simulate base environment variables
    const baseEnv = {
      NODE_ENV: "production",
    };

    // Mock .env file content with a JSON array variable
    const envFilePath = "test.env";
    const envFileContent = `NODES_EXCLUDE=["node1","node2","node3"]\n`;
    mockReadFile.mockResolvedValueOnce(envFileContent);

    // Ensure the file is reported as existing
    mockPathExists.mockResolvedValueOnce(true);

    // Call collectEnvironment
    const result = await collectEnvironment(baseEnv, envFilePath);

    // Validating the output
    expect(result).toEqual({
      NODE_ENV: "production", // Existing base environment remains
      NODES_EXCLUDE: '["node1","node2","node3"]', // JSON array is preserved
    });

    // Ensure the file operations were called as expected
    expect(mockPathExists).toHaveBeenCalledWith(envFilePath);
    expect(mockReadFile).toHaveBeenCalledWith(envFilePath, { encoding: "utf-8" });
  });

  it("should return base environment only if env file does not exist", async () => {
    // Simulate base environment variables
    const baseEnv = {
      NODE_ENV: "production",
    };

    const envFilePath = "nonexistent.env";

    // Simulate non-existing env file
    mockPathExists.mockResolvedValueOnce(false);

    // Call collectEnvironment
    const result = await collectEnvironment(baseEnv, envFilePath);

    // Validate that only base environment is returned
    expect(result).toEqual(baseEnv);

    // Ensure pathExists was called and readFile was not
    expect(mockPathExists).toHaveBeenCalledWith(envFilePath);
    expect(mockReadFile).not.toHaveBeenCalled();
  });
});