import React from "react";
import { ProcessStepConfirm } from "../process.js";
import { Text, useStdin } from "ink";

const InteractiveConfirmationDisabled = () => (
  <Text color="red">
    {" "}
    interactive input required; start this command with --force or --quiet to
    disable interactive prompts
  </Text>
);

export const ProcessConfirmationStateSummary: React.FC<{
  step: ProcessStepConfirm;
}> = ({ step }) => {
  const { isRawModeSupported } = useStdin();
  if (!isRawModeSupported) {
    return <InteractiveConfirmationDisabled />;
  }

  if (step.confirmed) {
    return <Text color="green"> confirmed</Text>;
  } else if (step.confirmed === false) {
    return <Text color="yellow"> not confirmed</Text>;
  } else {
    return (
      <>
        <Text>: press </Text>
        <Text color="blue">y</Text>
        <Text> or </Text>
        <Text color="blue">n</Text>
        <Text color="gray">
          {" "}
          (use the --force or --quiet flags to disable this prompt)
        </Text>
      </>
    );
  }
};
