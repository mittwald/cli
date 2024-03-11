import React, { useState } from "react";
import { ProcessStepInput } from "../process.js";
import { ProcessStateIcon } from "./ProcessStateIcon.js";
import { ProcessState } from "./ProcessState.js";
import { Box, Text, useStdin } from "ink";
import TextInput from "ink-text-input";
import { InteractiveInputDisabled } from "./InteractiveInputDisabled.js";

export const ProcessInput: React.FC<{
  step: ProcessStepInput;
  onSubmit: (_: string) => void;
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
            <Text color="blue">
              <TextInput
                mask={step.mask ? "*" : undefined}
                value={value}
                onChange={setValue}
                onSubmit={onSubmit}
              />
            </Text>
          ) : (
            <InteractiveInputDisabled />
          )}
        </Box>
      </>
    );
  }

  return <ProcessState step={step} />;
};
