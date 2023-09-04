import { waitUntil } from "../wait.js";
import React from "react";
import { Text } from "ink";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { ProcessRenderer } from "../../rendering/process/process.js";

export async function waitUntilAppIsInstalled(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  appInstallationId: string,
  eventId: string,
) {
  const stepWaiting = process.addStep(
    <Text>waiting for app installation to be ready</Text>,
  );

  await waitUntil(async () => {
    const installationResponse = await apiClient.app.getAppinstallation({
      appInstallationId,
      // TODO: Remove once @mittwald/api-client supports this
      headers: { "if-event-reached": eventId } as any, // eslint-disable-line
    });

    if (
      installationResponse.status === 200 &&
      installationResponse.data.appVersion.current ==
        installationResponse.data.appVersion.desired
    ) {
      return true;
    }
  });

  stepWaiting.complete();
}
