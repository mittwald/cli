import React, { FC } from "react";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Box } from "ink";
import { DomainHandle } from "./DomainHandle.js";
import { DomainBaseDetails } from "./DomainBaseDetails.js";
import DomainDomain = MittwaldAPIV2.Components.Schemas.DomainDomain;

export const DomainDetails: FC<{ domain: DomainDomain }> = ({ domain }) => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <DomainBaseDetails domain={domain} />
      <DomainHandle title="OWNER" handle={domain.handles.ownerC} />
      <DomainHandle title="ADMIN" handle={domain.handles.adminC} />
    </Box>
  );
};
