import { Text } from "ink";
import { FC } from "react";
import { formatRelativeDate, parseDate } from "../../textformat/formatDate.js";

interface Props {
  date: Date | string;
  absolute?: boolean;
  relative?: boolean;
}

export const FormattedDate: FC<Props> = (props) => {
  const { date: rawDate, absolute, relative } = props;
  const date = typeof rawDate === "string" ? parseDate(rawDate) : rawDate;

  if (date === undefined) {
    return "invalid date";
  }

  const relativeEl = relative ? formatRelativeDate(date) : null;
  const absoluteEl =
    absolute || (!relative && !absolute) ? date.toLocaleString() : null;

  if (relativeEl && absoluteEl) {
    return (
      <Text>
        {relativeEl} ({absoluteEl})
      </Text>
    );
  }

  return <Text>{absoluteEl || relativeEl}</Text>;
};
