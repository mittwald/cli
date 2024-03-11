import React, { ReactNode, useState } from "react";
import { ProcessStepSelect } from "../process.js";
import { ProcessStateIcon } from "./ProcessStateIcon.js";
import { ProcessState } from "./ProcessState.js";
import { Box, Text, useInput, useStdin } from "ink";
import { InteractiveInputDisabled } from "./InteractiveInputDisabled.js";

const useSelectControls = (
  initial: number | undefined,
  length: number,
  onSelect: (x: number) => void,
) => {
  const [value, setValue] = useState(initial);
  const [extraUsageHint, setExtraUsageHint] = useState(false);

  useInput((_, key) => {
    if (key.return) {
      if (value !== undefined) {
        setValue(value);
        onSelect(value);
      } else {
        setExtraUsageHint(true);
      }
    } else if (key.downArrow) {
      setExtraUsageHint(false);
      setValue((prev) =>
        prev === undefined ? 0 : Math.min(length - 1, prev + 1),
      );
    } else if (key.upArrow) {
      setExtraUsageHint(false);
      setValue((prev) => (prev === undefined ? 0 : Math.max(prev - 1, 0)));
    }
  });

  return {
    value,
    extraUsageHint,
  };
};

export const ProcessSelect: React.FC<{
  step: ProcessStepSelect;
  onSubmit: (_: number) => void;
}> = ({ step, onSubmit }) => {
  const { value, extraUsageHint } = useSelectControls(
    step.selected,
    step.options.length,
    onSubmit,
  );
  const { isRawModeSupported } = useStdin();

  if (step.selected === undefined) {
    if (!isRawModeSupported) {
      return (
        <Box marginX={2}>
          <ProcessStateIcon step={step} />
          <Text>{step.title}: </Text>
          <InteractiveInputDisabled />
        </Box>
      );
    }

    return (
      <>
        <Box marginX={2}>
          <ProcessStateIcon step={step} />
          <Text>{step.title}: </Text>
        </Box>
        <Box flexDirection="column">
          <SelectUsageHint extraHint={extraUsageHint} />
          {step.options.map((option, index) => (
            <SelectOption
              key={index}
              selected={index === value}
              label={option}
            />
          ))}
        </Box>
      </>
    );
  }

  return <ProcessState step={step} />;
};

function SelectUsageHint({ extraHint }: { extraHint: boolean }) {
  return (
    <Box marginLeft={4}>
      <Text color={extraHint ? "red" : "gray"} bold={extraHint}>
        (use the up and down keys to select an option)
      </Text>
    </Box>
  );
}

function SelectOption({
  selected,
  label,
}: {
  selected: boolean;
  label: ReactNode;
}) {
  return (
    <Box marginLeft={4}>
      <Text color="blue">
        {selected ? "👉︎ " : "   "}
        {label}
      </Text>
    </Box>
  );
}
