import { ProcessRenderer } from "../../../../rendering/process/process.js";
import { assertStatus } from "@mittwald/api-client-commons";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { getProject } from "../common.js";
import { getSSHConnectionForProject } from "../../ssh/project.js";
import { withTemporaryUser } from "./temp_user.js";

type DatabaseMySqlDatabase =
  MittwaldAPIV2.Components.Schemas.DatabaseMySqlDatabase;
type DatabaseMySqlUser = MittwaldAPIV2.Components.Schemas.DatabaseMySqlUser;
type Project = MittwaldAPIV2.Components.Schemas.ProjectProject;

export interface MySQLConnectionFlags {
  "mysql-password": string | undefined;
  "mysql-charset": string | undefined;
  "temporary-user"?: boolean;
  "ssh-user"?: string;
}

export interface MySQLConnectionDetails {
  hostname: string;
  database: string;
  user: string;
  sshHost: string;
  sshUser: string;
  project: Project;
  charset: string;
}

export type MySQLConnectionDetailsWithPassword = MySQLConnectionDetails & {
  password: string;
};

/**
 * Runs a callback function with connection details for a MySQL database.
 *
 * Depending on the flags, this function will either use the credentials
 * provided in the flags (or prompt for a password), or create a temporary user
 * for the operation, which will be cleaned up afterwards.
 */
export async function runWithConnectionDetails<TRes>(
  apiClient: MittwaldAPIV2Client,
  databaseId: string,
  p: ProcessRenderer,
  flags: MySQLConnectionFlags,
  cb: (connectionDetails: MySQLConnectionDetailsWithPassword) => Promise<TRes>,
): Promise<TRes> {
  const connectionDetails = await getConnectionDetailsWithPassword(
    apiClient,
    databaseId,
    p,
    flags,
  );

  if (flags["temporary-user"]) {
    return withTemporaryUser(apiClient, databaseId, p, async (user, password) =>
      cb({ ...connectionDetails, user: user.name, password }),
    );
  }

  return cb(connectionDetails);
}

export async function getConnectionDetailsWithPassword(
  apiClient: MittwaldAPIV2Client,
  databaseId: string,
  p: ProcessRenderer,
  flags: MySQLConnectionFlags,
): Promise<MySQLConnectionDetailsWithPassword> {
  const password = flags["temporary-user"] ? "" : await getPassword(p, flags);
  const sshUser = flags["ssh-user"];
  const characterSet = flags["mysql-charset"];
  return {
    ...(await getConnectionDetails(
      apiClient,
      databaseId,
      sshUser,
      characterSet,
      p,
    )),
    password,
  };
}

export async function getConnectionDetails(
  apiClient: MittwaldAPIV2Client,
  databaseId: string,
  sshUser: string | undefined,
  characterSet: string | undefined,
  p: ProcessRenderer,
): Promise<MySQLConnectionDetails> {
  const database = await getDatabase(apiClient, p, databaseId);
  const databaseUser = await getDatabaseUser(apiClient, p, databaseId);
  const project = await getProject(apiClient, p, database);
  const sshConnectionData = await getSSHConnectionForProject(
    apiClient,
    database.projectId,
    sshUser,
  );

  return {
    hostname: database.hostname,
    database: database.name,
    user: databaseUser.name,
    sshHost: sshConnectionData.host,
    sshUser: sshConnectionData.user,
    charset: characterSet ?? database.characterSettings.characterSet,
    project,
  };
}

async function getPassword(
  p: ProcessRenderer,
  flags: { "mysql-password": string | undefined },
) {
  if (flags["mysql-password"]) {
    return flags["mysql-password"];
  }

  return await p.addInput("enter password for MySQL user", true);
}

async function getDatabase(
  apiClient: MittwaldAPIV2Client,
  p: ProcessRenderer,
  mysqlDatabaseId: string,
): Promise<DatabaseMySqlDatabase> {
  return await p.runStep("fetching database", async () => {
    const r = await apiClient.database.getMysqlDatabase({
      mysqlDatabaseId,
    });
    assertStatus(r, 200);

    return r.data;
  });
}

async function getDatabaseUser(
  apiClient: MittwaldAPIV2Client,
  p: ProcessRenderer,
  databaseId: string,
): Promise<DatabaseMySqlUser> {
  return await p.runStep("fetching main user", async () => {
    const r = await apiClient.database.listMysqlUsers({
      mysqlDatabaseId: databaseId,
    });
    assertStatus(r, 200);

    const mainUser = r.data.find((u) => u.mainUser);
    if (!mainUser) {
      throw new Error("No main user found");
    }

    return mainUser;
  });
}
