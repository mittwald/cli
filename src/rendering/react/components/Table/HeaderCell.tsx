import * as Model from "./model/index.js";
import { Text } from "ink";
import React, { FC, isValidElement } from "react";
import { CellContainer } from "./CellContainer.js";

interface Props {
  col: Model.Column;
}

export const HeaderCell: FC<Props> = (props) => {
  const { col } = props;

  return (
    <CellContainer
      col={col}
      borderStyle="single"
      borderTop={false}
      borderLeft={false}
      borderRight={false}
    >
      <Text bold>{col.options.header ?? col.name.getHumanizedName()}</Text>
    </CellContainer>
  );
};
