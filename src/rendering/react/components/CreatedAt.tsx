import { FC } from "react";
import { Value } from "./Value.js";
import { FormattedDate } from "./FormattedDate.js";

interface Props {
  object: { createdAt: string | undefined };
}

export const CreatedAt: FC<Props> = (props) => {
  const date = props.object.createdAt;
  if (date === undefined) {
    return <Value notSet />;
  }
  return (
    <Value>
      <FormattedDate date={date} display="both" />
    </Value>
  );
};
