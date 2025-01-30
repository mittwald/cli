import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import { usePromise } from "@mittwald/react-use-promise";

export default function useOwnAccount(client: MittwaldAPIV2Client) {
  const result = usePromise(() => client.user.getUser({ userId: "self" }), []);
  assertStatus(result, 200);

  return result.data;
}
