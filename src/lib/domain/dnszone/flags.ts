import { isUuid } from "../../../Helpers.js";
import { makeProjectFlagSet } from "../../project/flags.js";
import { assertStatus } from "@mittwald/api-client-commons";

export const {
  flags: dnsZoneFlags,
  args: dnsZoneArgs,
  withId: withDnsZoneId,
} = makeProjectFlagSet("dnszone", "z", {
  normalize: async (apiClient, projectId, id): Promise<string> => {
    if (isUuid(id)) {
      return id;
    }

    const response = await apiClient.domain.dnsListDnsZones({ projectId });
    assertStatus(response, 200);

    const dnsZone = response.data.find((dnsZone) => dnsZone.domain === id);
    if (!dnsZone) {
      throw new Error(`DNS zone with domain "${id}" not found`);
    }

    return dnsZone.id;
  },
  shortIDName: "domain name",
});
