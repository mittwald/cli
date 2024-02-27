import { Text } from "ink";
import { FC } from "react";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Value } from "../Value.js";

interface Props {
  status: MittwaldAPIV2.Components.Schemas.ProjectProjectStatus;
}

export const ProjectSimpleStatus: FC<Props> = (props) => {
  const { status } = props;

  switch (status) {
    case "ready":
      return <Text color="green">{status} 🚀</Text>;
    case "migratingVolume":
    case "pending":
      return <Text color="blue">{status} 🏗</Text>;
    case "error":
      return <Text color="red">{status} 💀</Text>;
    case "disabled":
      return <Text color="red">{status} 🚫</Text>;
    default:
      return <Value notSet />;
  }
};
