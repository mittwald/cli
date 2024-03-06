import { expect, test } from "@oclif/test";

describe("database:mysql:create", () => {
  const projectId = "339d6458-839f-4809-a03d-78700069690c";
  const databaseId = "83e0cb85-dcf7-4968-8646-87a63980ae91";
  const userId = "a8c1eb2a-aa4d-4daf-8e21-9d91d56559ca";
  const password = "secret";
  const description = "Test";

  const createFlags = [
    "database mysql create",
    "--project-id",
    projectId,
    "--version",
    "8.0",
    "--description",
    description,
    "--user-password",
    password,
  ];

  test
    .nock("https://api.mittwald.de", (api) => {
      api.get(`/v2/projects/${projectId}`).reply(200, {
        id: projectId,
      });
      api
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

      api.get(`/v2/mysql-databases/${databaseId}`).reply(200, {
        id: databaseId,
        name: "mysql_xxxxxx",
      });

      api.get(`/v2/mysql-users/${userId}`).reply(200, {
        id: userId,
        name: "dbu_xxxxxx",
      });
    })
    .env({ MITTWALD_API_TOKEN: "foo" })
    .stdout()
    .command(createFlags)
    .it("creates a database and prints database and user name", (ctx) => {
      // cannot match on exact output, because linebreaks
      expect(ctx.stdout).to.contain("The database mysql_xxxxxx");
      expect(ctx.stdout).to.contain("the user dbu_xxxxxx");
    });

  test
    .nock("https://api.mittwald.de", (api) => {
      api.get(`/v2/projects/${projectId}`).reply(200, {
        id: projectId,
      });
      api
        .post(`/v2/projects/${projectId}/mysql-databases`, {
          database: {
            projectId,
            description: "Test",
            version: "8.0",
            characterSettings: {
              collation: "utf8mb4_unicode_ci",
              characterSet: "utf8mb4",
            },
          },
          user: {
            password: "secret",
            externalAccess: false,
            accessLevel: "full",
          },
        })
        .reply(201, { id: databaseId, userId });

      api.get(`/v2/mysql-databases/${databaseId}`).reply(200, {
        id: databaseId,
        name: "mysql_xxxxxx",
      });

      api.get(`/v2/mysql-users/${userId}`).times(3).reply(403);

      api.get(`/v2/mysql-users/${userId}`).reply(200, {
        id: userId,
        name: "dbu_xxxxxx",
      });
    })
    .env({ MITTWALD_API_TOKEN: "foo" })
    .stdout()
    .command(createFlags)
    .it("retries fetching user until successful", (ctx) => {
      // cannot match on exact output, because linebreaks
      expect(ctx.stdout).to.contain("The database mysql_xxxxxx");
      expect(ctx.stdout).to.contain("the user dbu_xxxxxx");
    });
});
