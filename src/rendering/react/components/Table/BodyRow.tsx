import React, { ReactElement } from "react";
import * as Model from "./model/index.js";
import { BodyCell } from "./BodyCell.js";
import { RowContainer } from "./RowContainer.js";

interface Props<TData> {
  row: Model.Row<TData>;
}

export function BodyRow<TData>(props: Props<TData>): ReactElement {
  const { row } = props;

  return (
    <RowContainer>
      {row.table.columns.map((col) => (
        <BodyCell cell={row.getCell(col.name)} key={col.name.value} />
      ))}
    </RowContainer>
  );
}
