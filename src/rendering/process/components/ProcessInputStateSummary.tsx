import React from "react";
import { ProcessStepInput } from "../process.js";
import { Text } from "ink";

export const ProcessInputStateSummary: React.FC<{
  step: ProcessStepInput;
}> = ({ step }) => {
  if (step.value && step.mask) {
    return (
      <>
        <Text>: </Text>
        <Text color="blue">[secret]</Text>
      </>
    );
  }

  if (step.value) {
    return (
      <>
        <Text>: </Text>
        <Text color="green">{step.value}</Text>
      </>
    );
  } else {
    return <Text>: </Text>;
  }
};
