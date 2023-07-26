import { assertStatus } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ProcessRenderer } from "../../rendering/react/process.js";
import AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
export async function triggerAppInstallation(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  projectId: string,
  flags: any,
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
          userInputs: [
            { name: "host", value: flags.host },
            { name: "site_title", value: flags["site-title"] },
            { name: "admin_user", value: flags["admin-user"] },
            { name: "admin_email", value: flags["admin-email"] },
            { name: "admin_pass", value: flags["admin-pass"] },
            {
              name: "admin_firstname",
              value: flags["admin-firstname"],
            },
            {
              name: "admin_lastname",
              value: flags["admin-lastname"],
            },
            { name: "shop_email", value: flags["shop-email"] },
            { name: "shop_lang", value: flags["shop-language"] },
            {
              name: "shop_currency",
              value: flags["shop-currency"],
            },
          ],
        },
      });

      assertStatus(result, 201);
      return [result.data.id, result.headers["etag"]];
    },
  );
  return [appInstallationId, eventId];
}
