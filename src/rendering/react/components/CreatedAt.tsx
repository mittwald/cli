import { FC } from "react";
import { Value } from "./Value.js";
import { Text } from "ink";
import { formatDate } from "../../../lib/viewhelpers/date.js";

export const CreatedAt: FC<{ object: { createdAt: string | undefined } }> = ({
  object,
}) => {
  if (!object.createdAt) {
    return <Value notSet />;
  }

  return (
    <Text>
      <Value>{formatDate(object.createdAt)}</Value> (
      <Value>{object.createdAt}</Value>)
    </Text>
  );
};
