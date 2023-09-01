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
        pathParameters: { projectId },
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

  await process.runStep(
    "waiting for installation to be retrievable",
    async () => {
      for (let attempts = 0; attempts < 10; attempts++) {
        const result = await apiClient.app.getAppinstallation({
          pathParameters: { appInstallationId },
        });
        if (result.status === 200) {
          return result.data;
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    },
  );

  if ("document-root" in flags && flags["document-root"] !== "/") {
    await process.runStep("setting document root", async () => {
      const result = await apiClient.app.patchAppinstallation({
        pathParameters: { appInstallationId },
        headers: { "if-event-reached": eventId },
        data: {
          customDocumentRoot: flags["document-root"],
        },
      });

      assertStatus(result, 204);
    });
  }

  return [appInstallationId, eventId];
}
