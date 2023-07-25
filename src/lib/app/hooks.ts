import { MittwaldAPIV2 } from "@mittwald/api-client";
import AppSystemSoftware = MittwaldAPIV2.Components.Schemas.AppSystemSoftware;
import { usePromise } from "@mittwald/react-use-promise";
import { assertStatus } from "@mittwald/api-client-commons";
import { useRenderContext } from "../../rendering/react/context.js";
import AppSystemSoftwareVersion = MittwaldAPIV2.Components.Schemas.AppSystemSoftwareVersion;
import AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;

export function useAppVersion(
  appId: string,
  appVersionId: string,
): AppAppVersion {
  const { apiClient } = useRenderContext();
  const appVersion = usePromise(
    (appId, appVersionId) =>
      apiClient.app.getAppversion({
        pathParameters: { appId, appVersionId },
      }),
    [appId, appVersionId],
  );
  assertStatus(appVersion, 200);

  return appVersion.data;
}

export function useSystemSoftware(systemSoftwareId: string): AppSystemSoftware {
  const { apiClient } = useRenderContext();
  const systemSoftware = usePromise(
    (id) =>
      apiClient.app.getSystemsoftware({
        pathParameters: { systemSoftwareId: id },
      }),
    [systemSoftwareId],
  );
  assertStatus(systemSoftware, 200);

  return systemSoftware.data;
}

export function useSystemSoftwareVersion(
  systemSoftwareId: string,
  systemSoftwareVersionId: string,
): AppSystemSoftwareVersion {
  const { apiClient } = useRenderContext();
  const systemSoftwareVersion = usePromise(
    (systemSoftwareId, systemSoftwareVersionId) =>
      apiClient.app.getSystemsoftwareversion({
        pathParameters: {
          systemSoftwareId,
          systemSoftwareVersionId,
        },
      }),
    [systemSoftwareId, systemSoftwareVersionId],
  );

  assertStatus(systemSoftwareVersion, 200);
  return systemSoftwareVersion.data;
}
