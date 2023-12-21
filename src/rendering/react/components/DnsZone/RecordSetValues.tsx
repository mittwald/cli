import React, { FC } from "react";
import { Text } from "ink";

export const RecordSetValues: FC<{ records: string[] }> = ({ records }) => {
  return <Text>{records.join("\n")}</Text>;
};
