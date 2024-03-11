import React from "react";
import { ProcessStepSelect } from "../process.js";
import { Text } from "ink";

export function ProcessSelectStateSummary<TVal>({
  step,
}: {
  step: ProcessStepSelect<TVal>;
}) {
  if (step.selected) {
    return (
      <>
        <Text>: </Text>
        <Text color="green">
          {step.options.find((o) => o.value === step.selected)?.label}
        </Text>
      </>
    );
  } else {
    return <Text>: </Text>;
  }
}
