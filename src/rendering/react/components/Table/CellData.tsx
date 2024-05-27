import React, { FC, isValidElement } from "react";
import { FormattedDate } from "../FormattedDate.js";
import { JSONView } from "../JSONView.js";
import { parseDate } from "../../../textformat/formatDate.js";
import { Value } from "../Value.js";

interface Props {
  data: unknown;
}

export const CellData: FC<Props> = (props) => {
  const { data } = props;

  if (data === null || data === undefined) {
    return <Value notSet />;
  }

  if (isValidElement(data)) {
    return data;
  }

  if (data instanceof Date) {
    return <FormattedDate date={data} relative />;
  }

  if (typeof data === "string") {
    const date = parseDate(data);
    if (date) {
      return <FormattedDate relative date={data} />;
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
