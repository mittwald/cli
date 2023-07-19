import { FC } from "react";
import { SingleResult, SingleResultTable } from "../SingleResult.js";
import { Value } from "../Value.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import CustomerContact = MittwaldAPIV2.Components.Schemas.CustomerContact;

export const OrganizationOwner: FC<{ owner: CustomerContact }> = ({
  owner,
}) => {
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
