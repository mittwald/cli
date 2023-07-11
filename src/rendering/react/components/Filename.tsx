import { Text } from "ink";
import React from "react";

export const Filename: React.FC<{ filename: string }> = ({ filename }) => {
  return <Text color="yellow">{filename}</Text>;
}