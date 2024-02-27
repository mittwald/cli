import { ProcessRenderer } from "../../../rendering/process/process.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { getProject, getUser } from "../common.js";
type DatabaseRedisDatabase =
  MittwaldAPIV2.Components.Schemas.DatabaseRedisDatabase;

export async function getConnectionDetails(
  apiClient: MittwaldAPIV2Client,
  databaseId: string,
  p: ProcessRenderer,
) {
  const database = await getDatabase(apiClient, p, databaseId);
  const project = await getProject(apiClient, p, database);
  const user = await getUser(apiClient, p);

  return {
    hostname: database.hostname,
    database: database.name,
    sshHost: `ssh.${project.clusterID}.${project.clusterDomain}`,
    sshUser: `${user.email}@${project.shortId}`,
  };
}

async function getDatabase(
  apiClient: MittwaldAPIV2Client,
  p: ProcessRenderer,
  redisDatabaseId: string,
): Promise<DatabaseRedisDatabase> {
  return await p.runStep("fetching database", async () => {
    const r = await apiClient.database.getRedisDatabase({
      redisDatabaseId,
    });
    assertStatus(r, 200);

    return r.data;
  });
}
