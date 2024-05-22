import { waitUntil } from "../../wait.js";
import React from "react";
import { Text } from "ink";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { ProcessRenderer } from "../../../rendering/process/process.js";

export async function waitUntilAppStateHasNormalized(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  appInstallationId: string,
  label: string,
) {
  const stepWaiting = process.addStep(<Text>{label}</Text>);

  await waitUntil(async () => {
    const installationResponse = await apiClient.app.getAppinstallation({
      appInstallationId,
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
