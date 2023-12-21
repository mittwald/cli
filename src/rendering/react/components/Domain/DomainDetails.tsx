import React, { FC } from "react";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Box } from "ink";
import { DomainHandle } from "./DomainHandle.js";
import { DomainBaseDetails } from "./DomainBaseDetails.js";
import DomainDomain = MittwaldAPIV2.Components.Schemas.DomainDomain;

export const DomainDetails: FC<{ domain: DomainDomain }> = ({ domain }) => {
  const sections = [
    <DomainBaseDetails key="primary" domain={domain} />,
    <DomainHandle key="owner" title="OWNER" handle={domain.handles.ownerC} />,
    <DomainHandle key="admin" title="ADMIN" handle={domain.handles.adminC} />,
  ];

  return (
    <Box flexDirection="column" marginBottom={1}>
      {sections}
    </Box>
  );
};
