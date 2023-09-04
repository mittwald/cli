import { assertStatus } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ProcessRenderer } from "../../rendering/process/process.js";
import AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
export async function triggerAppInstallation(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  projectId: string,
  flags: Record<string, string>,
  appVersion: AppAppVersion,
) {
  const [appInstallationId, eventId] = await process.runStep(
    "starting installation",
    async (): Promise<[string, string]> => {
      const result = await apiClient.app.requestAppinstallation({
        projectId,
        data: {
          appVersionId: appVersion.id,
          description: flags["site-title"],
          updatePolicy: "none",
          userInputs: Object.keys(flags).map((k) => ({
            name: k.replace("-", "_"),
            value: flags[k],
          })),
        },
      });

      assertStatus(result, 201);
      return [result.data.id, result.headers["etag"]];
    },
  );
  return [appInstallationId, eventId];
}
