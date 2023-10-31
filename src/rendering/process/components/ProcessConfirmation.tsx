import React from "react";
import { ProcessStep } from "../process.js";
import { ProcessState } from "./ProcessState.js";
import { useInput, useStdin } from "ink";

export const ProcessConfirmation: React.FC<{
  step: ProcessStep;
  onConfirm: (_: boolean) => void;
}> = ({ step, onConfirm }) => {
  const { isRawModeSupported } = useStdin();
  if (isRawModeSupported) {
    useInput((input) => {
      onConfirm(input === "y");
    });
  }

  return <ProcessState step={step} />;
};
