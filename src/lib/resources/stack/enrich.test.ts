import { describe, expect, it, jest, beforeEach } from "@jest/globals";

const mockReadFile = jest.fn<typeof import("fs/promises").readFile>();

jest.unstable_mockModule("fs/promises", () => ({
  readFile: mockReadFile,
}));

const { enrichStackDefinition } = await import("./enrich.js");

describe("enrichStackDefinition", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should resolve environment lists to objects", async () => {
    const input = {
      services: {
        webapp: {
          image: "postgres:latest",
          environment: ["something=little", 'bit="of love"'],
        },
      },
    };

    const expected = {
      services: {
        webapp: {
          image: "postgres:latest",
          environment: {
            something: "little",
            bit: "of love",
          },
        },
      },
    };

    const result = await enrichStackDefinition(input);
    expect(result).toEqual(expected);
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("should handle service without env_file", async () => {
    const input = {
      services: {
        nginx: {
          image: "nginx:latest",
          ports: ["80:80"],
        },
      },
    };

    const result = await enrichStackDefinition(input);

    expect(result).toEqual(input);
    expect(mockReadFile).not.toHaveBeenCalled();
  });

  it("should handle single env_file as string", async () => {
    mockReadFile.mockResolvedValueOnce("FOO=bar\nBAZ=qux");

    const input = {
      services: {
        nginx: {
          image: "nginx:latest",
          env_file: ".env",
        },
      },
    };

    const result = await enrichStackDefinition(input);

    expect(mockReadFile).toHaveBeenCalledWith(".env", "utf-8");
    expect(result).toEqual({
      services: {
        nginx: {
          image: "nginx:latest",
          envs: {
            FOO: "bar",
            BAZ: "qux",
          },
        },
      },
    });
  });

  it("should handle env_file as array", async () => {
    mockReadFile
      .mockResolvedValueOnce("FOO=bar\nBAZ=qux")
      .mockResolvedValueOnce("FOO=overridden\nNEW=value");

    const input = {
      services: {
        nginx: {
          image: "nginx:latest",
          env_file: [".env", ".env.local"],
        },
      },
    };

    const result = await enrichStackDefinition(input);

    expect(mockReadFile).toHaveBeenCalledWith(".env", "utf-8");
    expect(mockReadFile).toHaveBeenCalledWith(".env.local", "utf-8");
    expect(result).toEqual({
      services: {
        nginx: {
          image: "nginx:latest",
          envs: {
            FOO: "overridden", // Later file should override
            BAZ: "qux",
            NEW: "value",
          },
        },
      },
    });
  });

  it("should merge env_file variables with existing envs", async () => {
    mockReadFile.mockResolvedValueOnce("FOO=from_file\nFILE_VAR=file_value");

    const input = {
      services: {
        nginx: {
          image: "nginx:latest",
          env_file: ".env",
          envs: {
            FOO: "existing", // Should override env_file
            EXISTING_VAR: "existing_value",
          },
        },
      },
    };

    const result = await enrichStackDefinition(input);

    expect(result).toEqual({
      services: {
        nginx: {
          image: "nginx:latest",
          envs: {
            FOO: "existing", // Existing envs take precedence
            FILE_VAR: "file_value",
            EXISTING_VAR: "existing_value",
          },
        },
      },
    });
  });

  it("should handle multiple services with different env_file configurations", async () => {
    mockReadFile
      .mockResolvedValueOnce("NGINX_VAR=nginx_value")
      .mockResolvedValueOnce("APP_VAR=app_value1")
      .mockResolvedValueOnce("APP_VAR=app_value2\nOTHER=other");

    const input = {
      services: {
        nginx: {
          image: "nginx:latest",
          env_file: ".env.nginx",
        },
        app: {
          image: "app:latest",
          env_file: [".env.app", ".env.app.local"],
        },
        db: {
          image: "postgres:latest",
          // No env_file
        },
      },
    };

    const result = await enrichStackDefinition(input);

    expect(result).toEqual({
      services: {
        nginx: {
          image: "nginx:latest",
          envs: {
            NGINX_VAR: "nginx_value",
          },
        },
        app: {
          image: "app:latest",
          envs: {
            APP_VAR: "app_value2", // Later file overrides
            OTHER: "other",
          },
        },
        db: {
          image: "postgres:latest",
        },
      },
    });
  });

  it("should handle empty env files", async () => {
    mockReadFile.mockResolvedValueOnce("");

    const input = {
      services: {
        nginx: {
          image: "nginx:latest",
          env_file: ".env",
        },
      },
    };

    const result = await enrichStackDefinition(input);

    expect(result).toEqual({
      services: {
        nginx: {
          image: "nginx:latest",
          envs: {},
        },
      },
    });
  });
});
