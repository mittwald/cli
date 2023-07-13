import React, { ReactElement } from "react";
import * as Model from "./model/index.js";
import { BodyCell } from "./BodyCell.js";
import { RowLayout } from "./RowLayout.js";

interface Props<TData> {
  row: Model.Row<TData>;
}

export function BodyRow<TData>(props: Props<TData>): ReactElement {
  const { row } = props;

  return (
    <RowLayout>
      {row.table.columns.map((col) => (
        <BodyCell cell={row.getCell(col.name)} key={col.name.value} />
      ))}
    </RowLayout>
  );
}
