import { Text } from "ink";
import React, { FC } from "react";
import { FormatDate } from "../FormatDate.js";
import { JSONView } from "../JSONView.js";
import { parseDate } from "../../../../lib/viewhelpers/date.js";

interface Props {
  data: unknown;
}

export const CellData: FC<Props> = (props) => {
  const { data } = props;

  if (data === null || data === undefined) {
    return <Text dimColor>n/a</Text>;
  }

  if (data instanceof Date) {
    return <FormatDate date={data} />;
  }

  if (typeof data === "string") {
    const date = parseDate(data);
    if (date) {
      return <FormatDate date={date} />;
    }
    return data;
  }

  if (typeof data === "object") {
    return <JSONView inline json={data} />;
  }

  if (typeof data === "boolean") {
    return data ? "yes" : "no";
  }

  return "";
};
