import { Text } from "ink";
import React, { PropsWithChildren } from "react";

export type ValueProps = PropsWithChildren<{ notSet?: boolean }>;

export const Value: React.FC<ValueProps> = ({ children, notSet }) => {
  if (notSet) {
    return <Text color="gray">not set</Text>;
  }
  return <Text color="blue">{children}</Text>;
};
