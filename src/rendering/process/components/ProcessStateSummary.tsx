import React from "react";
import { ProcessStep } from "../process.js";
import { ProcessConfirmationStateSummary } from "./ProcessConfirmationStateSummary.js";
import { ProcessInputStateSummary } from "./ProcessInputStateSummary.js";
import { Text } from "ink";
import { ProcessSelectStateSummary } from "./ProcessSelectStateSummary.js";

export const ProcessStateSummary: React.FC<{ step: ProcessStep }> = ({
  step,
}) => {
  if (step.type === "info") {
    return <></>;
  } else if (step.type === "confirm") {
    return <ProcessConfirmationStateSummary step={step} />;
  } else if (step.type === "input") {
    return <ProcessInputStateSummary step={step} />;
  } else if (step.type === "select") {
    return <ProcessSelectStateSummary step={step} />;
  } else if (step.phase === "completed") {
    return (
      <>
        <Text>. </Text>
        <Text color="green">done</Text>
      </>
    );
  } else if (step.phase === "aborted") {
    return (
      <>
        <Text>. </Text>
        <Text color="yellow">cancelled</Text>
      </>
    );
  } else if (step.phase === "failed") {
    return (
      <>
        <Text>. </Text>
        <Text color="red">error</Text>
      </>
    );
  } else {
    if (step.progress) {
      return (
        <>
          <Text>... </Text>
          <Text color="blue">{step.progress}</Text>
        </>
      );
    }
    return <Text>...</Text>;
  }
};
