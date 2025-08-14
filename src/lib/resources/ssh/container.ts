import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SSHConnectionData } from "./types.js";

export async function getSSHConnectionForContainer(
  client: MittwaldAPIV2Client,
  containerId: string,
  stackId: string,
  sshUser: string | undefined,
): Promise<SSHConnectionData> {
  // Get container details
  const containerResponse = await client.container.getService({
    stackId,
    serviceId: containerId,
  });

  assertStatus(containerResponse, 200);

  // Get project details
  const projectResponse = await client.project.getProject({
    projectId: containerResponse.data.projectId,
  });

  assertStatus(projectResponse, 200);

  // If no SSH user is provided, use the current user's email
  if (sshUser === undefined) {
    const userResponse = await client.user.getUser({ userId: "self" });

    assertStatus(userResponse, 200);
    sshUser = userResponse.data.email;
  }

  // Construct the SSH connection data
  const host = `ssh.${projectResponse.data.clusterID}.${projectResponse.data.clusterDomain}`;
  const user = `${sshUser}@${containerResponse.data.shortId}`;
  const directory = "/";

  return {
    host,
    user,
    directory,
  };
}
