import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";
import { orgArgs, withOrgId } from "../../lib/org/flags.js";
import { RenderBaseCommand } from "../../rendering/react/RenderBaseCommand.js";
import { FC, ReactNode } from "react";
import { usePromise } from "@mittwald/react-use-promise";
import { assertStatus } from "@mittwald/api-client-commons";
import { RenderJson } from "../../rendering/react/json/RenderJson.js";
import { SingleResult } from "../../rendering/react/components/SingleResult.js";
import { Value } from "../../rendering/react/components/Value.js";
import { CreatedAt } from "../../rendering/react/components/CreatedAt.js";
import { Box } from "ink";
import { useRenderContext } from "../../rendering/react/context.js";
import { OrganizationOwner } from "../../rendering/react/components/Organization/OrganizationOwner.js";
import { CustomerIDAndNumber } from "../../rendering/react/components/Organization/CustomerIDAndNumber.js";
import { OrganizationOrderEligibility } from "../../rendering/react/components/Organization/OrganizationOrderEligibility.js";

type CustomerCustomer = MittwaldAPIV2.Components.Schemas.CustomerCustomer;

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomersCustomerId.Get.Parameters.Path;

const GetOrganization: FC<{ response: CustomerCustomer }> = ({ response }) => {
  const rows = {
    "Organization ID": <CustomerIDAndNumber object={response} />,
    "Created At": <CreatedAt object={{ createdAt: response.creationDate }} />,
  };

  const { apiClient } = useRenderContext();
  const competency = usePromise(
    (id) =>
      apiClient.customer.isCustomerLegallyCompetent({
        customerId: id,
      }),
    [response.customerId],
  );

  assertStatus(competency, 200);

  const sections = [
    <SingleResult
      key="primary"
      title={
        <>
          ORGANIZATION DETAILS: <Value>{response.name}</Value>
        </>
      }
      rows={rows}
    />,
    <OrganizationOrderEligibility
      key="competency"
      competency={competency.data}
    />,
  ];

  if (response.owner) {
    sections.push(<OrganizationOwner key="owner" owner={response.owner} />);
  }

  return (
    <Box flexDirection="column" marginBottom={1}>
      {sections}
    </Box>
  );
};

export class Get extends RenderBaseCommand<typeof Get> {
  static description = "Get an organization profile.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = { ...orgArgs };

  protected render(): ReactNode {
    const customerId = usePromise(
      () => withOrgId(this.apiClient, Get, this.flags, this.args, this.config),
      [],
    );
    const customerResponse = usePromise(
      (id: string) =>
        this.apiClient.customer.getCustomer({
          customerId: id,
        }),
      [customerId],
    );

    assertStatus(customerResponse, 200);

    if (this.flags.output === "json") {
      return <RenderJson name="org" data={customerResponse.data} />;
    }

    return <GetOrganization response={customerResponse.data} />;
  }
}
