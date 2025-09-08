import { waitUntil } from "../../wait.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import Duration from "../../units/Duration.js";

export async function waitUntilAppStateHasNormalized(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  appInstallationId: string,
  label: string,
  timeout: Duration,
) {
  const stepWaiting = process.addStep(label);

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
  }, timeout);

  stepWaiting.complete();
}
