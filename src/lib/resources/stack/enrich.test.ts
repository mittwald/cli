import { type MittwaldAPIV2 } from "@mittwald/api-client";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";

const mockReadFile = jest.fn<typeof import("fs/promises").readFile>();

jest.unstable_mockModule("fs/promises", () => ({
  readFile: mockReadFile,
}));

const { enrichStackDefinition } = await import("./enrich.js");
const { loadStackFromStr } = await import("./loader.js");
const { sanitizeStackDefinition } = await import("./sanitize.js");

type StackRequest =
  MittwaldAPIV2.Paths.V2StacksStackId.Put.Parameters.RequestBody;

describe("enrichStackDefinition", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should resolve environment lists to objects", async () => {
    const input = {
      services: {
        webapp: {
          image: "postgres:latest",
          envs: ["something=little", 'bit="of love"'],
        },
      },
    };

    const expected = {
      services: {
        webapp: {
          image: "postgres:latest",
          envs: {
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

describe("Integration Test: Docker Compose to Mittwald API Request transformation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should transform Docker Compose file, environment variables, and CLI args into a valid API request", async () => {
    // Sample Docker Compose file content
    const dockerComposeFile = `
      version: '3'
      services:
        nginx:
          image: 'nginx:latest'
          ports:
            - "80:80"
          environment:
            APP_ENV: "development"
            API_URL: "\${CUSTOM_API_URL:-https://default.api}"
          env_file:
            - ".env"
            - ".env.local"
    `;

    // Mocking environment variables (process.env)
    const cliEnv = {
      CUSTOM_API_URL: "https://cli.api",
    };

    // Mocking .env files using fs/promises
    mockReadFile
      .mockResolvedValueOnce("DB_HOST=db.local\nDB_PORT=5432") // Content of .env
      .mockResolvedValueOnce("DB_HOST=db.override.local\nDB_USER=user123"); // Content of .env.local

    // Step 1: Load and parse Docker Compose file
    const parsedStack = await loadStackFromStr(dockerComposeFile, cliEnv);

    // Step 2: Sanitize stack definition ( compat layer )
    const sanitizedStack = sanitizeStackDefinition(parsedStack);

    // Step 3: Enrich stack definition (process environment variables)
    const enrichedStack = await enrichStackDefinition(sanitizedStack);

    // Expected API request format after the transformation
    const expectedApiRequest: Partial<StackRequest> = {
      services: {
        nginx: {
          image: "nginx:latest",
          ports: ["80:80"],
          envs: {
            APP_ENV: "development", // From compose file
            API_URL: "https://cli.api", // Default value overridden by CLI env
            DB_HOST: "db.override.local", // Overridden by .env.local
            DB_PORT: "5432", // Value from first .env file
            DB_USER: "user123", // Value from .env.local
          },
        },
      },
    };

    // Assertions
    expect(enrichedStack).toMatchObject(expectedApiRequest);

    // Type Assertions
    const typeCheck: StackRequest = enrichedStack;
    expect(typeCheck).toBeTruthy();

    // Ensure env files are read in order
    expect(mockReadFile).toHaveBeenCalledWith(".env", "utf-8");
    expect(mockReadFile).toHaveBeenCalledWith(".env.local", "utf-8");
  });


  it("should transform Docker Compose file with list environment, environment variables, and CLI args into a valid API request", async () => {
    // Sample Docker Compose file content
    const dockerComposeFile = `
      version: '3'
      services:
        nginx:
          image: 'nginx:latest'
          ports:
            - "80:80"
          environment:
            - APP_ENV=development
            - API_URL=\${CUSTOM_API_URL:-https://default.api}
          env_file:
            - ".env"
            - ".env.local"
    `;

    // Mocking environment variables (process.env)
    const cliEnv = {
      CUSTOM_API_URL: "https://cli.api",
    };

    // Mocking .env files using fs/promises
    mockReadFile
      .mockResolvedValueOnce("DB_HOST=db.local\nDB_PORT=5432") // Content of .env
      .mockResolvedValueOnce("DB_HOST=db.override.local\nDB_USER=user123"); // Content of .env.local

    // Step 1: Load and parse Docker Compose file
    const parsedStack = await loadStackFromStr(dockerComposeFile, cliEnv);

    // Step 2: Sanitize stack definition ( compat layer )
    const sanitizedStack = sanitizeStackDefinition(parsedStack);

    console.warn(sanitizedStack);

    // Step 3: Enrich stack definition (process environment variables)
    const enrichedStack = await enrichStackDefinition(sanitizedStack);

    console.warn(enrichedStack);

    // Expected API request format after the transformation
    const expectedApiRequest: Partial<StackRequest> = {
      services: {
        nginx: {
          image: "nginx:latest",
          ports: ["80:80"],
          envs: {
            APP_ENV: "development", // From compose file
            API_URL: "https://cli.api", // Default value overridden by CLI env
            DB_HOST: "db.override.local", // Overridden by .env.local
            DB_PORT: "5432", // Value from first .env file
            DB_USER: "user123", // Value from .env.local
          },
        },
      },
    };

    // Assertions
    expect(enrichedStack).toMatchObject(expectedApiRequest);

    // Type Assertions
    const typeCheck: StackRequest = enrichedStack;
    expect(typeCheck).toBeTruthy();

    // Ensure env files are read in order
    expect(mockReadFile).toHaveBeenCalledWith(".env", "utf-8");
    expect(mockReadFile).toHaveBeenCalledWith(".env.local", "utf-8");
  });

});
