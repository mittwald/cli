import React from "react";
import { ProcessStepSelect } from "../process.js";
import { Text } from "ink";

export const ProcessSelectStateSummary: React.FC<{
  step: ProcessStepSelect;
}> = ({ step }) => {
  if (step.selected) {
    return (
      <>
        <Text>: </Text>
        <Text color="green">{step.options[step.selected]}</Text>
      </>
    );
  } else {
    return <Text>: </Text>;
  }
};
