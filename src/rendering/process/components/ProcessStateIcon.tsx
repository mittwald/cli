import React from "react";
import { ProcessStep } from "../process.js";
import { Text } from "ink";

export const ProcessStateIcon: React.FC<{ step: ProcessStep }> = ({ step }) => {
  if (step.type === "info") {
    return <Text>💡 </Text>;
  } else if (
    step.type === "confirm" ||
    step.type === "input" ||
    step.type === "select"
  ) {
    return <Text>❓</Text>;
  } else if (step.phase === "completed") {
    return <Text>✅ </Text>;
  } else if (step.phase === "aborted") {
    return <Text>⏩️ </Text>;
  } else if (step.phase === "failed") {
    return <Text>❌</Text>;
  } else {
    return <Text>🔁 </Text>;
  }
};
