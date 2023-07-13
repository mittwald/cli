import { Text } from "ink";
import { FC } from "react";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Value } from "./Value.js";

interface Props {
  readiness: MittwaldAPIV2.Components.Schemas.ProjectProjectReadinessStatus;
}

export const ProjectReadiness: FC<Props> = (props) => {
  const { readiness } = props;

  switch (readiness) {
    case "ready":
      return <Text color="green">ready 🚀</Text>;
    case "creating":
      return <Text color="blue">creating 🏗</Text>;
    case "unready":
      return <Text color="red">unready 💀</Text>;
    default:
      return <Value notSet />;
  }
};
