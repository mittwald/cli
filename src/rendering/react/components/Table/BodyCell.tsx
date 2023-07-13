import * as Model from "./model/index.js";
import React, { FC } from "react";
import { CellLayout } from "./CellLayout.js";
import { CellData } from "./CellData.js";

interface Props {
  cell: Model.Cell<unknown>;
}

export const BodyCell: FC<Props> = (props) => {
  const { cell } = props;

  return (
    <CellLayout col={cell.column}>
      <CellData data={cell.getData()} />
    </CellLayout>
  );
};
