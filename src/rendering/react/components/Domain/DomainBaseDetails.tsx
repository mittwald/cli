import React, { FC } from "react";
import { Value } from "../Value.js";
import { SingleResult } from "../SingleResult.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { BooleanValue } from "../BooleanValue.js";
import DomainDomain = MittwaldAPIV2.Components.Schemas.DomainDomain;

export const DomainBaseDetails: FC<{ domain: DomainDomain }> = ({ domain }) => {
  const title = (
    <>
      DOMAIN: <Value>{domain.domain}</Value>
    </>
  );

  const rows = {
    ID: <Value>{domain.domainId}</Value>,
    Connected: <BooleanValue value={domain.connected} />,
    Nameservers: <Value>{domain.nameservers.join("\n")}</Value>,
  };

  return <SingleResult title={title} rows={rows} />;
};
