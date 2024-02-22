import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SSHConnectionData } from "./types.js";

export async function getSSHConnectionForProject(
  client: MittwaldAPIV2Client,
  projectId: string,
  sshUser: string | undefined,
): Promise<SSHConnectionData> {
  const projectResponse = await client.project.getProject({ projectId });

  assertStatus(projectResponse, 200);

  if (sshUser === undefined) {
    const userResponse = await client.user.getOwnAccount();

    assertStatus(userResponse, 200);
    sshUser = userResponse.data.email;
  }

  const host = `ssh.${projectResponse.data.clusterID}.${projectResponse.data.clusterDomain}`;
  const user = `${sshUser}@${projectResponse.data.shortId}`;
  const directory = projectResponse.data.directories["Web"];

  return {
    host,
    user,
    directory,
  };
}
