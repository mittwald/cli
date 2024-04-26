import { ProcessRenderer } from "../../../rendering/process/process.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { getSSHConnectionForProject } from "../../ssh/project.js";

type DatabaseRedisDatabase =
  MittwaldAPIV2.Components.Schemas.DatabaseRedisDatabase;

export async function getConnectionDetails(
  apiClient: MittwaldAPIV2Client,
  databaseId: string,
  sshUserOverride: string | undefined,
  p: ProcessRenderer,
) {
  const database = await getDatabase(apiClient, p, databaseId);
  const { user: sshUser, host: sshHost } = await getSSHConnectionForProject(
    apiClient,
    database.projectId,
    sshUserOverride,
  );

  return {
    hostname: database.hostname,
    database: database.name,
    sshHost,
    sshUser,
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
