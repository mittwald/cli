import { MittwaldAPIV2Client, assertStatus } from "@mittwald/api-client";
import path from "path";
import { SSHConnectionData } from "./types.js";

export async function getSSHConnectionForAppInstallation(
  client: MittwaldAPIV2Client,
  appInstallationId: string,
): Promise<SSHConnectionData> {
  const appInstallationResponse = await client.app.getAppinstallation({
    appInstallationId,
  });

  assertStatus(appInstallationResponse, 200);

  if (appInstallationResponse.data.projectId === undefined) {
    throw new Error("Project ID of app must not be undefined");
  }

  const projectResponse = await client.project.getProject({
    projectId: appInstallationResponse.data.projectId,
  });

  assertStatus(projectResponse, 200);

  const userResponse = await client.user.getOwnAccount();

  assertStatus(userResponse, 200);

  const host = `ssh.${projectResponse.data.clusterID}.${projectResponse.data.clusterDomain}`;
  const user = `${userResponse.data.email}@${appInstallationResponse.data.shortId}`;
  const directory = path.join(
    projectResponse.data.directories["Web"],
    appInstallationResponse.data.installationPath,
  );

  return {
    host,
    user,
    directory,
  };
}
