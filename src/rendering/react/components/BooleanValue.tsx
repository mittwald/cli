import React, { FC } from "react";
import { Text } from "ink";
import { Value } from "./Value.js";

export const BooleanValue: FC<{ value: boolean | undefined }> = ({ value }) => {
  if (value === undefined) {
    return <Value notSet />;
  }
  return value ? <Text color="green">yes</Text> : <Text color="red">no</Text>;
};
