import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import assertSuccess from "../../../apiutil/assert_success.js";
import { ProcessRenderer } from "../../../../rendering/process/process.js";
import { randomInt } from "crypto";

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

/**
 * Generates a random password that fulfills the requirements for [mysql
 * passwords][mysql].
 *
 * [mysql]: https://developer.mittwald.de/docs/v2/api/security/passwords#mysql
 *
 * @param length Desired length in characters
 * @returns A randomly generated password
 */
export function generateRandomPassword(length: number = 32): string {
  // Character pools
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const specialChars = "#!~%^*_+-=?{}()<>|.,;";
  const allChars = lowercase + uppercase + digits + specialChars;

  // Ensure the password includes at least one of each required character type
  const passwordArray = [
    lowercase[randomInt(0, lowercase.length)],
    uppercase[randomInt(0, uppercase.length)],
    digits[randomInt(0, digits.length)],
    specialChars[randomInt(0, specialChars.length)],
  ];

  // Fill the remaining characters randomly
  for (let i = passwordArray.length; i < length; i++) {
    passwordArray.push(allChars[randomInt(0, allChars.length)]);
  }

  // Shuffle the array to avoid predictable patterns
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join("");
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
