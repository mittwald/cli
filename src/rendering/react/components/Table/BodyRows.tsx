import React, { FC } from "react";
import { BodyRow } from "./BodyRow.js";
import * as Model from "./model/index.js";

interface Props {
  table: Model.Table;
}

export const BodyRows: FC<Props> = (props) => {
  const { table } = props;

  return (
    <>
      {table.rows.map((row) => (
        <BodyRow row={row} key={row.index} />
      ))}
    </>
  );
};
