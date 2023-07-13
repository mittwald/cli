import * as Model from "./model/index.js";
import { Box } from "ink";
import React, { ComponentProps, FC } from "react";
import { RowLayout } from "./RowLayout.js";
import { HeaderCell } from "./HeaderCell.js";

interface Props extends ComponentProps<typeof Box> {
  table: Model.Table;
}

export const HeaderRow: FC<Props> = (props: Props) => {
  const { table, ...boxProps } = props;

  return (
    <RowLayout {...boxProps}>
      {table.columns.map((col) => (
        <HeaderCell col={col} key={col.name.value} />
      ))}
    </RowLayout>
  );
};
