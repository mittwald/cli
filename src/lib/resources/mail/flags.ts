import { makeProjectFlagSet } from "../project/flags.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { validate as validateUuid } from "uuid";

export const {
  flags: mailAddressFlags,
  args: mailAddressArgs,
  withId: withMailAddressId,
} = makeProjectFlagSet("mailaddress", "m", {
  normalize: async (apiClient, projectId, id): Promise<string> => {
    if (validateUuid(id)) {
      return id;
    }

    const response = await apiClient.mail.listMailAddresses({
      projectId,
    });
    assertStatus(response, 200);

    const address = response.data.find((address) => address.address === id);
    if (!address) {
      throw new Error(`mail address with id "${id}" not found`);
    }

    return address.id;
  },
  shortIDName: "mail address",
});
