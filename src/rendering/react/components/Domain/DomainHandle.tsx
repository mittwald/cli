import React, { FC, ReactNode } from "react";
import { SingleResult } from "../SingleResult.js";
import { Value } from "../Value.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Text } from "ink";
import DomainHandleReadable = MittwaldAPIV2.Components.Schemas.DomainHandleReadable;

export const DomainHandle: FC<{
  title: ReactNode;
  handle: DomainHandleReadable | undefined;
}> = ({ title, handle }) => {
  if (handle === undefined) {
    return (
      <SingleResult
        title={title}
        rows={{
          "Handle reference": <Value notSet />,
        }}
      />
    );
  }

  const rows: Record<string, ReactNode> = {
    "Handle reference": <Value>{handle.current.handleRef}</Value>,
  };

  for (const handleField of handle.current.handleFields ?? []) {
    const desired = (handle.desired?.handleFields ?? []).find(
      (f) => f.name === handleField.name,
    )?.value;
    if (desired) {
      rows[handleField.name] = (
        <Text>
          <Value>{handleField.value}</Value> updating to{" "}
          <Value>{desired}</Value>
        </Text>
      );
    } else {
      rows[handleField.name] = <Value>{handleField.value}</Value>;
    }
  }

  return <SingleResult title={title} rows={rows} />;
};
