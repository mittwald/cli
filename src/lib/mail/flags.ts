import { isUuid } from "../../normalize_id.js";
import { makeProjectFlagSet } from "../project/flags.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { Flags } from "@oclif/core";

export const {
  flags: mailAddressFlags,
  args: mailAddressArgs,
  withId: withMailAddressId,
} = makeProjectFlagSet("mailaddress", "m", {
  normalize: async (apiClient, projectId, id): Promise<string> => {
    if (isUuid(id)) {
      return id;
    }

    const response = await apiClient.mail.listMailAddresses({
      projectId,
    });
    assertStatus(response, 200);

    const address = response.data.find((address) => address.id === id);
    if (!address) {
      throw new Error(`mail address with id "${id}" not found`);
    }

    return address.id;
  },
  shortIDName: "mail address",
});

export const sharedMailAddressFlags = {
  address: Flags.string({
    char: "a",
    summary: "mail address",
    required: true,
  }),
  "catch-all": Flags.boolean({
    description: "make this a catch-all mail address",
  }),
};
