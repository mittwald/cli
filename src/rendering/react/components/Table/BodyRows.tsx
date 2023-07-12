import React, { FC } from "react";
import { BodyRow } from "./BodyRow.js";
import * as Model from "./model/index.js";

interface Props {
  table: Model.Table<unknown>;
}

export const BodyRows: FC<Props> = (props) => {
  const { table } = props;

  return (
    <>
      {table.rows.map((row, index) => (
        <BodyRow row={row} key={index} />
      ))}
    </>
  );
};
