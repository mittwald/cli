import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
import { validate as validateUuid } from "uuid";

type AppLinkedDatabase = MittwaldAPIV2.Components.Schemas.AppLinkedDatabase;

/**
 * Resolves a database identifier, which may be either a full UUID or a database
 * name, to the database's UUID. Names are looked up among the project's MySQL
 * and Redis databases.
 */
export async function resolveDatabaseId(
  apiClient: MittwaldAPIV2Client,
  projectId: string,
  candidate: string,
): Promise<string> {
  if (validateUuid(candidate)) {
    return candidate;
  }

  const mysql = await apiClient.database.listMysqlDatabases({ projectId });
  assertStatus(mysql, 200);
  const mysqlMatch = mysql.data.find((db) => db.name === candidate);
  if (mysqlMatch) {
    return mysqlMatch.id;
  }

  const redis = await apiClient.database.listRedisDatabases({ projectId });
  assertStatus(redis, 200);
  const redisMatch = redis.data.find((db) => db.name === candidate);
  if (redisMatch) {
    return redisMatch.id;
  }

  throw new Error(
    `No database named "${candidate}" was found in this project.`,
  );
}

/**
 * Picks the linked database to act on from an app installation's linked
 * databases. When a purpose is given, the matching database is returned;
 * otherwise the sole linked database is used, and an ambiguous selection raises
 * an error.
 */
export function selectLinkedDatabase(
  linkedDatabases: AppLinkedDatabase[],
  purpose?: string,
): AppLinkedDatabase {
  if (linkedDatabases.length === 0) {
    throw new Error("This app installation has no linked database.");
  }

  if (purpose) {
    const match = linkedDatabases.find((db) => db.purpose === purpose);
    if (!match) {
      throw new Error(
        `This app installation has no linked database with purpose "${purpose}".`,
      );
    }
    return match;
  }

  if (linkedDatabases.length > 1) {
    const purposes = linkedDatabases.map((db) => db.purpose).join(", ");
    throw new Error(
      `This app installation has multiple linked databases (${purposes}); use --purpose to select one.`,
    );
  }

  return linkedDatabases[0];
}
