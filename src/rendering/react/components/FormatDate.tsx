import { Text } from "ink";
import { FC } from "react";
import { formatDate } from "../../../lib/viewhelpers/date.js";

interface Props {
  date: Date;
}

export const FormatDate: FC<Props> = (props) => {
  const { date } = props;
  return <Text>{formatDate(date)}</Text>;
};
