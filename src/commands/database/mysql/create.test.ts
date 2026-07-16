import nock from "nock";
import { runCommand } from "@oclif/test";
import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";

describe("database:mysql:create", () => {
  const projectId = "339d6458-839f-4809-a03d-78700069690c";
  const databaseId = "83e0cb85-dcf7-4968-8646-87a63980ae91";
  const userId = "a8c1eb2a-aa4d-4daf-8e21-9d91d56559ca";
  const password = "secret";
  const description = "Test";

  const createFlags = [
    "--project-id",
    projectId,
    "--version",
    "8.0",
    "--description",
    description,
    "--user-password",
    password,
  ];

  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    process.env["MITTWALD_API_TOKEN"] = "foo";

    nock.disableNetConnect();
  });

  afterEach(() => {
    process.env = originalEnv;
    nock.cleanAll();
  });

  it("creates a database and prints database and user name", async () => {
    const scope = nock("https://api.mittwald.de");

    scope.get(`/v2/projects/${projectId}`).reply(200, {
      id: projectId,
    });
    scope
      .post(`/v2/projects/${projectId}/mysql-databases`, {
        database: {
          projectId,
          description,
          version: "8.0",
          characterSettings: {
            collation: "utf8mb4_unicode_ci",
            characterSet: "utf8mb4",
          },
        },
        user: {
          password,
          externalAccess: false,
          accessLevel: "full",
        },
      })
      .reply(201, { id: databaseId, userId });

    scope.get(`/v2/mysql-databases/${databaseId}`).reply(200, {
      id: databaseId,
      name: "mysql_xxxxxx",
    });

    scope.get(`/v2/mysql-users/${userId}`).reply(200, {
      id: userId,
      name: "dbu_xxxxxx",
    });

    const { stdout, stderr, error } = await runCommand([
      "database:mysql:create",
      ...createFlags,
    ]);

    console.log("foo");

    setTimeout(() => scope.done(), 5000);

    expect(stdout).toContain("The database mysql_xxxxxx");
    expect(stdout).toContain("the user dbu_xxxxxx");
    expect(stderr).toEqual("");
    expect(error).toBeUndefined();
  });

  // Skipped, to be fixed later
  it("retries fetching user until successful", async () => {
    const scope = nock("https://api.mittwald.de");

    scope.get(`/v2/projects/${projectId}`).reply(200, {
      id: projectId,
    });
    scope
      .post(`/v2/projects/${projectId}/mysql-databases`, {
        database: {
          projectId,
          description,
          version: "8.0",
          characterSettings: {
            collation: "utf8mb4_unicode_ci",
            characterSet: "utf8mb4",
          },
        },
        user: {
          password,
          externalAccess: false,
          accessLevel: "full",
        },
      })
      .reply(201, { id: databaseId, userId });

    scope.get(`/v2/mysql-databases/${databaseId}`).reply(200, {
      id: databaseId,
      name: "mysql_xxxxxx",
    });

    scope.get(`/v2/mysql-users/${userId}`).times(3).reply(403);

    scope.get(`/v2/mysql-users/${userId}`).reply(200, {
      id: userId,
      name: "dbu_xxxxxx",
    });

    const { stdout, stderr, error } = await runCommand([
      "database:mysql:create",
      ...createFlags,
    ]);

    console.log("foo");

    setTimeout(() => scope.done(), 5000);

    expect(stdout).toContain("The database mysql_xxxxxx");
    expect(stdout).toContain("the user dbu_xxxxxx");
    expect(stderr).toEqual("");
    expect(error).toBeUndefined();
  });
});
