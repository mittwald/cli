import React, { FC } from "react";
import { DomainConnectionHints } from "./DomainConnectionHints.js";
import { PortForwardingHints } from "./PortForwardingHints.js";
import { ParsedPort } from "./types.js";

interface PortConnectionHintsProps {
  ports: ParsedPort[];
  containerId: string;
  containerName: string;
}

/**
 * PortConnectionHints orchestrates the display of both domain connection and
 * port forwarding options for containers with exposed ports.
 */
export const PortConnectionHints: FC<PortConnectionHintsProps> = ({
  ports,
  containerId,
  containerName,
}) => {
  return (
    <>
      <DomainConnectionHints ports={ports} containerId={containerId} />
      <PortForwardingHints ports={ports} containerName={containerName} />
    </>
  );
};
