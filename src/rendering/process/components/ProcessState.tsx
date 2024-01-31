import React from "react";
import { ProcessStep } from "../process.js";
import { ProcessStateIcon } from "./ProcessStateIcon.js";
import { ProcessStateSummary } from "./ProcessStateSummary.js";
import { ProcessError } from "./ProcessError.js";
import { Box, Text } from "ink";

export const ProcessState: React.FC<{ step: ProcessStep }> = ({ step }) => {
  return (
    <>
      <Box marginX={2}>
        <ProcessStateIcon step={step} />
        <Text>{step.title}</Text>
        <ProcessStateSummary step={step} />
      </Box>

      {step.type === "step" && step.output ? (
        <Box marginX={6}>
          <Text color="gray">
            {step.output.split("\n").slice(-10).join("\n")}
          </Text>
        </Box>
      ) : null}

      {step.type === "step" && step.error ? (
        <ProcessError err={step.error} />
      ) : null}
    </>
  );
};
