import { Text } from "ink";
import { FC } from "react";
import {
  formatRelativeDate,
  parseDate,
} from "../../../lib/viewhelpers/date.js";

interface Props {
  date: Date | string;
  display?: "absolute" | "relative" | "both";
}

export const FormattedDate: FC<Props> = (props) => {
  const { date: rawDate, display = "absolute" } = props;
  const date = typeof rawDate === "string" ? parseDate(rawDate) : rawDate;

  if (date === undefined) {
    return "invalid date";
  }

  const relative =
    display === "relative" || display === "both"
      ? formatRelativeDate(date)
      : null;

  const absolute =
    display === "absolute" || display === "both" ? date.toLocaleString() : null;

  if (absolute && relative) {
    return (
      <Text>
        {relative} ({absolute})
      </Text>
    );
  }

  return <Text>{absolute || relative}</Text>;
};
