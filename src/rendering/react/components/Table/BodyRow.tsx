import React, { FC } from "react";
import * as Model from "./model/index.js";
import { BodyCell } from "./BodyCell.js";
import { RowLayout } from "./RowLayout.js";

interface Props {
  row: Model.Row;
}

export const BodyRow: FC<Props> = (props) => {
  const { row } = props;

  return (
    <RowLayout>
      {row.table.columns.map((col) => (
        <BodyCell cell={row.getCell(col.name)} key={col.name.value} />
      ))}
    </RowLayout>
  );
};
