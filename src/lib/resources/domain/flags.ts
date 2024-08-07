import { makeProjectFlagSet } from "../project/flags.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { validate as validateUuid } from "uuid";

export const {
  flags: domainFlags,
  args: domainArgs,
  withId: withDomainId,
} = makeProjectFlagSet("domain", "d", {
  normalize: async (apiClient, projectId, id): Promise<string> => {
    if (validateUuid(id)) {
      return id;
    }

    const response = await apiClient.domain.listDomains({
      queryParameters: { projectId },
    });
    assertStatus(response, 200);

    const domain = response.data.find(({ domain }) => domain === id);
    if (!domain) {
      throw new Error(`DNS zone with domain "${id}" not found`);
    }

    return domain.domainId;
  },
  shortIDName: "domain name",
});
