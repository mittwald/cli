import { ProcessRenderer } from "../../rendering/process/process.js";
import { DDEVDatabaseFlags } from "./flags.js";
import {
  assertStatus,
  type MittwaldAPIV2,
  type MittwaldAPIV2Client,
} from "@mittwald/api-client";

type AppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;

/**
 * Determines the database ID to use for the DDEV project.
 *
 * This is done according to the following rules (in order of precedence):
 *
 * 1. If the `--without-database` flag is set, do not use a database.
 * 2. If the `--database-id` flag is set, use the database with the given ID.
 * 3. If the app installation has a linked database with the purpose "primary", use
 *    that database.
 * 4. Otherwise, prompt the user to select a database from the list of databases
 *    present in the project.
 * 5. If interactive input is not available, terminate with an error.
 */
export async function determineDDEVDatabaseId(
  r: ProcessRenderer,
  apiClient: MittwaldAPIV2Client,
  flags: DDEVDatabaseFlags,
  appInstallation: AppInstallation,
): Promise<string | undefined> {
  let databaseId: string | undefined = flags["database-id"];
  const withoutDatabase = flags["without-database"];

  if (withoutDatabase) {
    return undefined;
  }

  if (databaseId === undefined) {
    databaseId = (appInstallation.linkedDatabases ?? []).find(
      (db) => db.purpose === "primary",
    )?.databaseId;
  }

  if (databaseId !== undefined) {
    const mysqlDatabaseResponse = await apiClient.database.getMysqlDatabase({
      mysqlDatabaseId: databaseId,
    });
    assertStatus(mysqlDatabaseResponse, 200);

    r.addInfo(`using database: ${mysqlDatabaseResponse.data.name}`);
    return mysqlDatabaseResponse.data.name;
  }

  return await promptDatabaseFromUser(r, apiClient, appInstallation);
}

async function promptDatabaseFromUser(
  r: ProcessRenderer,
  apiClient: MittwaldAPIV2Client,
  appInstallation: AppInstallation,
): Promise<string | undefined> {
  const { projectId } = appInstallation;
  if (!projectId) {
    throw new Error("app installation has no project ID");
  }

  const mysqlDatabaseResponse = await apiClient.database.listMysqlDatabases({
    projectId,
  });
  assertStatus(mysqlDatabaseResponse, 200);

  return await r.addSelect("select the database to use", [
    ...mysqlDatabaseResponse.data.map((db) => ({
      value: db.name,
      label: `${db.name} (${db.description})`,
    })),
    {
      value: undefined,
      label: "no database",
    },
  ]);
}
