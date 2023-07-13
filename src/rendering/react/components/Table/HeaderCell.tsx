import * as Model from "./model/index.js";
import { Text } from "ink";
import React, { FC } from "react";
import { CellLayout } from "./CellLayout.js";

interface Props {
  col: Model.Column;
}

export const HeaderCell: FC<Props> = (props) => {
  const { col } = props;

  return (
    <CellLayout
      col={col}
      borderStyle="single"
      borderTop={false}
      borderLeft={false}
      borderRight={false}
    >
      <Text bold>{col.options.header ?? col.name.humanizedName}</Text>
    </CellLayout>
  );
};
