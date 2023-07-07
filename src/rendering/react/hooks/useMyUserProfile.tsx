import { useRenderContext } from "../context.js";
import { usePromise } from "@mittwald/react-use-promise";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";

export const useMyUserProfile =
  (): MittwaldAPIV2.Components.Schemas.SignupProfile => {
    const { apiClient } = useRenderContext();
    const myUserId = usePromise(apiClient.user.getOwnProfile, [], {
      loaderId: "getOwnProfile",
    });
    assertStatus(myUserId, 200);
    return myUserId.data;
  };
