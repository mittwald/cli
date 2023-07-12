import { Text } from "ink";
import React, { ReactNode } from "react";

export const Value: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <Text color="blue">{children}</Text>;
};