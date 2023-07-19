import { MittwaldAPIV2 } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";
import { orgArgs, withOrgId } from "../../lib/org/flags.js";
import { RenderBaseCommand } from "../../rendering/react/RenderBaseCommand.js";
import { FC, ReactNode } from "react";
import { usePromise } from "@mittwald/react-use-promise";
import { assertStatus } from "@mittwald/api-client-commons";
import { RenderJson } from "../../rendering/react/json/RenderJson.js";
import {
  SingleResult,
  SingleResultTable,
} from "../../rendering/react/components/SingleResult.js";
import { Value } from "../../rendering/react/components/Value.js";
import { CreatedAt } from "../../rendering/react/components/CreatedAt.js";
import { CustomerIDAndNumber } from "../../rendering/react/components/CustomerIDAndNumber.js";
import { Box, Text } from "ink";
import { useRenderContext } from "../../rendering/react/context.js";
import CustomerCustomer = MittwaldAPIV2.Components.Schemas.CustomerCustomer;
import CustomerContact = MittwaldAPIV2.Components.Schemas.CustomerContact;

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomersCustomerId.Get.Parameters.Path;

const OrganizationOwner: FC<{ owner: CustomerContact }> = ({ owner }) => {
  return (
    <SingleResult
      key="owner"
      title="Organization Owner"
      rows={{
        Company: <Value notSet={!owner.company}>{owner.company}</Value>,
        Name: (
          <Value>
            {owner.firstName} {owner.lastName}
          </Value>
        ),
        Email: <Value notSet={!owner.emailAddress}>{owner.emailAddress}</Value>,
        Address: (
          <SingleResultTable
            rows={{
              "Street address": (
                <Value>
                  {owner.address.street} {owner.address.houseNumber}
                </Value>
              ),
              City: (
                <Value>
                  {owner.address.zip} {owner.address.city},{" "}
                  {owner.address.countryCode}
                </Value>
              ),
            }}
          />
        ),
      }}
    />
  );
};

const GetOrganization: FC<{ response: CustomerCustomer }> = ({ response }) => {
  const rows = {
    "Organization ID": <CustomerIDAndNumber object={response} />,
    "Created At": <CreatedAt object={{ createdAt: response.creationDate }} />,
  };

  const { apiClient } = useRenderContext();
  const competency = usePromise(
    (id) =>
      apiClient.customer.isCustomerLegallyCompetent({
        pathParameters: { customerId: id },
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
    <SingleResult
      key="competency"
      title="Order eligibility"
      rows={{
        "Can place orders?": (
          <Value>
            {competency.data.isLegallyCompetent ? (
              <Text color="green">yes</Text>
            ) : (
              <>
                <Text color="red">no</Text>
                <Text color="gray">
                  {" "}
                  (make sure to complete your organization owner profile)
                </Text>
              </>
            )}
          </Value>
        ),
      }}
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
      () => withOrgId(this.apiClient, this.flags, this.args, this.config),
      [],
    );
    const customerResponse = usePromise(
      (id: string) =>
        this.apiClient.customer.getCustomer({ pathParameters: { customerId } }),
      [customerId],
    );

    assertStatus(customerResponse, 200);

    if (this.flags.output === "json") {
      return <RenderJson name="org" data={customerResponse.data} />;
    }

    return <GetOrganization response={customerResponse.data} />;
  }
}
