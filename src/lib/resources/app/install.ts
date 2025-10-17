import { assertStatus } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ProcessRenderer } from "../../../rendering/process/process.js";

type AppAppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;
type AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;

export async function triggerAppInstallation(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  projectId: string,
  flags: {
    "site-title": string;
    "document-root"?: string;
    "install-path"?: string;
  } & {
    [k: string]: unknown;
  },
  appVersion: AppAppVersion,
): Promise<AppAppInstallation> {
  const appInstallationId = await process.runStep(
    "starting installation",
    async (): Promise<string> => {
      const result = await apiClient.app.requestAppinstallation({
        projectId,
        data: {
          appVersionId: appVersion.id,
          description: flags["site-title"],
          updatePolicy: "none",
          installationPath: flags["install-path"],
          userInputs: Object.keys(flags).map((k) => ({
            name: k.replace("-", "_"),
            value: flags[k] as string,
          })),
        },
      });

      assertStatus(result, 201);
      return result.data.id;
    },
  );

  await process.runStep(
    "waiting for installation to be retrievable",
    async () => {
      for (let attempts = 0; attempts < 10; attempts++) {
        const result = await apiClient.app.getAppinstallation({
          appInstallationId,
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
        appInstallationId,
        data: {
          customDocumentRoot: flags["document-root"] as string,
        },
      });

      assertStatus(result, 204);
    });
  }

  const result = await apiClient.app.getAppinstallation({ appInstallationId });
  assertStatus(result, 200);

  return result.data;
}
