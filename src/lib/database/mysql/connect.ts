import { ProcessRenderer } from "../../../rendering/react/process.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import DatabaseMySqlDatabase = MittwaldAPIV2.Components.Schemas.DatabaseMySqlDatabase;
import DatabaseMySqlUser = MittwaldAPIV2.Components.Schemas.DatabaseMySqlUser;
import SignupAccount = MittwaldAPIV2.Components.Schemas.SignupAccount;
import ProjectProject = MittwaldAPIV2.Components.Schemas.ProjectProject;

export async function getConnectionDetailsWithPassword(
  apiClient: MittwaldAPIV2Client,
  databaseId: string,
  p: ProcessRenderer,
  flags: { "mysql-password": string | undefined },
) {
  const password = await getPassword(p, flags);
  return {
    ...(await getConnectionDetails(apiClient, databaseId, p)),
    password,
  };
}

export async function getConnectionDetails(
  apiClient: MittwaldAPIV2Client,
  databaseId: string,
  p: ProcessRenderer,
) {
  const database = await getDatabase(apiClient, p, databaseId);
  const databaseUser = await getDatabaseUser(apiClient, p, databaseId);
  const project = await getProject(apiClient, p, database);
  const user = await getUser(apiClient, p);

  return {
    hostname: database.hostname,
    database: database.name,
    user: databaseUser.name,
    sshHost: `ssh.${project.clusterID}.${project.clusterDomain}`,
    sshUser: `${user.email}@${project.shortId}`,
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
  id: string,
): Promise<DatabaseMySqlDatabase> {
  return await p.runStep("fetching database", async () => {
    const r = await apiClient.database.getMysqlDatabase({
      pathParameters: { id },
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
      pathParameters: { databaseId },
    });
    assertStatus(r, 200);

    const mainUser = r.data.find((u) => u.mainUser);
    if (!mainUser) {
      throw new Error("No main user found");
    }

    return mainUser;
  });
}

async function getUser(
  apiClient: MittwaldAPIV2Client,
  p: ProcessRenderer,
): Promise<SignupAccount> {
  return await p.runStep("fetching user", async () => {
    const r = await apiClient.user.getOwnAccount();
    assertStatus(r, 200);

    return r.data;
  });
}

async function getProject(
  apiClient: MittwaldAPIV2Client,
  p: ProcessRenderer,
  database: DatabaseMySqlDatabase,
): Promise<ProjectProject> {
  return await p.runStep("fetching project", async () => {
    const r = await apiClient.project.getProject({
      pathParameters: { id: database.projectId },
    });
    assertStatus(r, 200);

    return r.data;
  });
}
