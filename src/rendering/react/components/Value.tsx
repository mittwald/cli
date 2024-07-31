import { Text } from "ink";
import React, { PropsWithChildren } from "react";

export type ValueProps = PropsWithChildren<{
  notSet?: boolean;
  bold?: boolean;
}>;

export const Value: React.FC<ValueProps> = ({ children, notSet, bold }) => {
  if (notSet || children === undefined) {
    return <Text color="gray">not set</Text>;
  }
  return (
    <Text color="blue" bold={bold}>
      {children}
    </Text>
  );
};
