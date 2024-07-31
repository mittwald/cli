import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import { randomBytes } from "crypto";
import assertSuccess from "../../../apiutil/assert_success.js";
import { ProcessRenderer } from "../../../../rendering/process/process.js";

type DatabaseMySqlUser = MittwaldAPIV2.Components.Schemas.DatabaseMySqlUser;

async function createTemporaryUser(
  apiClient: MittwaldAPIV2Client,
  databaseId: string,
  password: string,
): Promise<string> {
  const createResponse = await apiClient.database.createMysqlUser({
    mysqlDatabaseId: databaseId,
    data: {
      accessLevel: "full", // needed for "PROCESS" privilege
      externalAccess: false,
      password,
      databaseId,
      description: "Temporary user for exporting/importing database",
    },
  });

  assertStatus(createResponse, 201);
  return createResponse.data.id;
}

async function retrieveTemporaryUser(
  apiClient: MittwaldAPIV2Client,
  mysqlUserId: string,
): Promise<DatabaseMySqlUser> {
  const userResponse = await apiClient.database.getMysqlUser({
    mysqlUserId,
  });
  assertStatus(userResponse, 200);

  return userResponse.data;
}

function generateRandomPassword(): string {
  return randomBytes(32).toString("base64");
}

/**
 * Runs a callback function with a temporary user for a database operation.
 *
 * Note: This is implemented with a callback parameter, because this function
 * also handles the cleanup of the temporary user after the callback has been
 * executed.
 */
export async function withTemporaryUser<TRes>(
  apiClient: MittwaldAPIV2Client,
  databaseId: string,
  p: ProcessRenderer,
  cb: (tempUser: DatabaseMySqlUser, password: string) => Promise<TRes>,
): Promise<TRes> {
  const password = generateRandomPassword();
  const user = await p.runStep("creating temporary user", async () => {
    const mysqlUserId = await createTemporaryUser(
      apiClient,
      databaseId,
      password,
    );

    return await retrieveTemporaryUser(apiClient, mysqlUserId);
  });

  try {
    return await cb(user, password);
  } finally {
    await p.runStep("removing temporary user", async () => {
      const response = await apiClient.database.deleteMysqlUser({
        mysqlUserId: user.id,
      });
      assertSuccess(response);
    });
  }
}
