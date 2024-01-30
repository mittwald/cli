import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SSHConnectionData } from "./types.js";

export async function getSSHConnectionForProject(
  client: MittwaldAPIV2Client,
  projectId: string,
): Promise<SSHConnectionData> {
  const projectResponse = await client.project.getProject({ projectId });

  assertStatus(projectResponse, 200);

  const userResponse = await client.user.getOwnAccount();

  assertStatus(userResponse, 200);

  const host = `ssh.${projectResponse.data.clusterID}.${projectResponse.data.clusterDomain}`;
  const user = `${userResponse.data.email}@${projectResponse.data.shortId}`;
  const directory = projectResponse.data.directories["Web"];

  return {
    host,
    user,
    directory,
  };
}
