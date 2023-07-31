import React, { useState } from "react";
import { ProcessStepInput } from "../process.js";
import { ProcessStateIcon } from "./ProcessStateIcon.js";
import { ProcessState } from "./ProcessState.js";
import { Box, Text, useStdin } from "ink";
import TextInput from "ink-text-input";

const InteractiveInputDisabled = () => (
  <Text color="red">
    interactive input required; inspect this command's --help page to learn how
    to pass the required input non-interactively.
  </Text>
);

export const ProcessInput: React.FC<{
  step: ProcessStepInput;
  onSubmit: (value: string) => void;
}> = ({ step, onSubmit }) => {
  const [value, setValue] = useState("");
  if (!step.value) {
    const { isRawModeSupported } = useStdin();
    return (
      <>
        <Box marginX={2}>
          <ProcessStateIcon step={step} />
          <Text>{step.title}: </Text>
          {isRawModeSupported ? (
            <TextInput
              mask={step.mask ? "*" : undefined}
              value={value}
              onChange={setValue}
              onSubmit={onSubmit}
            />
          ) : (
            <InteractiveInputDisabled />
          )}
        </Box>
      </>
    );
  }

  return <ProcessState step={step} />;
};
