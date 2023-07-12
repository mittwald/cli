import * as Model from "./model/index.js";
import React, { FC } from "react";
import { CellContainer } from "./CellContainer.js";
import { CellContent } from "./CellContent.js";

interface Props {
  cell: Model.Cell<unknown>;
}

export const BodyCell: FC<Props> = (props) => {
  const { cell } = props;

  return (
    <CellContainer col={cell.column}>
      <CellContent data={cell.data} />
    </CellContainer>
  );
};
