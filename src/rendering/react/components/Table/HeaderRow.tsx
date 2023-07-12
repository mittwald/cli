import * as Model from "./model/index.js";
import { Box } from "ink";
import React, { ComponentProps, FC } from "react";
import { RowContainer } from "./RowContainer.js";
import { HeaderCell } from "./HeaderCell.js";

interface Props extends ComponentProps<typeof Box> {
  table: Model.Table<unknown>;
}

export const HeaderRow: FC<Props> = (props: Props) => {
  const { table, ...boxProps } = props;

  return (
    <RowContainer {...boxProps}>
      {table.columns.map((col) => (
        <HeaderCell col={col} key={col.name.value} />
      ))}
    </RowContainer>
  );
};
