import React from "react";
import { Text } from "ink";

export const InteractiveInputDisabled = () => (
  <Text color="red">
    interactive input required; inspect this command's --help page to learn how
    to pass the required input non-interactively.
  </Text>
);
