import { ProcessRenderer } from "../../../rendering/process/process.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { getProject } from "../common.js";
import { getSSHConnectionForProject } from "../../ssh/project.js";
type DatabaseMySqlDatabase =
  MittwaldAPIV2.Components.Schemas.DatabaseMySqlDatabase;
type DatabaseMySqlUser = MittwaldAPIV2.Components.Schemas.DatabaseMySqlUser;

export async function getConnectionDetailsWithPassword(
  apiClient: MittwaldAPIV2Client,
  databaseId: string,
  p: ProcessRenderer,
  flags: {
    "mysql-password": string | undefined;
    "temporary-user"?: boolean;
    "ssh-user"?: string;
  },
) {
  const password = flags["temporary-user"] ? "" : await getPassword(p, flags);
  const sshUser = flags["ssh-user"];
  return {
    ...(await getConnectionDetails(apiClient, databaseId, sshUser, p)),
    password,
  };
}

export async function getConnectionDetails(
  apiClient: MittwaldAPIV2Client,
  databaseId: string,
  sshUser: string | undefined,
  p: ProcessRenderer,
) {
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
