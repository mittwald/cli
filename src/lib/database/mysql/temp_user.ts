import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import { randomBytes } from "crypto";
import assertSuccess from "../../assert_success.js";

type DatabaseMySqlUser = MittwaldAPIV2.Components.Schemas.DatabaseMySqlUser;

export interface TemporaryUser {
  user: DatabaseMySqlUser;
  password: string;

  cleanup(): Promise<void>;
}

/**
 * Creates a temporary user for a database operation.
 *
 * Caution: The returned TemporaryUser object contains a "cleanup()" function;
 * callers of the createTemporaryUser function must make sure to call this
 * function (even in case of errors) to reliably clean up any temporary users.
 */
export async function createTemporaryUser(
  apiClient: MittwaldAPIV2Client,
  databaseId: string,
): Promise<TemporaryUser> {
  const password = randomBytes(32).toString("base64");
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

  const userResponse = await apiClient.database.getMysqlUser({
    mysqlUserId: createResponse.data.id,
  });
  assertStatus(userResponse, 200);

  return {
    user: userResponse.data,
    password,
    async cleanup() {
      const response = await apiClient.database.deleteMysqlUser({
        mysqlUserId: createResponse.data.id,
      });
      assertSuccess(response);
    },
  };
}
