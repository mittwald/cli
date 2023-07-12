import { Text, Box } from "ink";
import React, { FC, ReactNode } from "react";
import { FormatDate } from "../FormatDate.js";
import { JSONView } from "../JSONView.js";
import { parseDate } from "../../../../lib/viewhelpers/date.js";

interface Props {
  data: unknown;
}

export const CellContent: FC<Props> = (props) => {
  const { data } = props;

  let content: ReactNode = "";

  if (data === null || data === undefined) {
    content = <Text dimColor>n/a</Text>;
  } else if (data instanceof Date) {
    content = <FormatDate date={data} />;
  } else if (typeof data === "string") {
    const date = parseDate(data);
    if (date) {
      content = <FormatDate date={date} />;
    } else {
      content = data;
    }
  } else if (typeof data === "object") {
    content = <JSONView inline json={data} />;
  } else if (typeof data === "boolean") {
    content = data ? "yes" : "no";
  }

  return content;
};
