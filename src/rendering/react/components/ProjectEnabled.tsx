import { Text } from "ink";
import { FC } from "react";

interface Props {
  enabled: boolean;
}

export const ProjectEnabled: FC<Props> = (props) => {
  const { enabled } = props;
  if (enabled) {
    return <Text color="green">enabled</Text>;
  }
  return <Text color="red">disabled</Text>;
};
