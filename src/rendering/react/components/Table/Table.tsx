import * as Model from "./model/index.js";
import React, { Children, ReactNode, useRef } from "react";
import { Box } from "ink";
import { useRenderContext } from "../../context.js";
import { RenderJson } from "../../json/RenderJson.js";
import { MeasureContextProvider } from "../../measure/MeasureContextProvider.js";
import { HeaderRow } from "./HeaderRow.js";
import { BodyRows } from "./BodyRows.js";
import { ColumnElementType, getOptionsFromColumnElements } from "./Column.js";
import { InferredOutput } from "../../../setup/FlagSupportedSetup.js";
import { TableRenderSetup } from "../../../setup/TableRenderSetup.js";

interface Props<TData> {
  data: TData[];
  setup: InferredOutput<typeof TableRenderSetup>;
  children?: Array<ColumnElementType> | ColumnElementType;
}

export function Table<TData>(props: Props<TData>): ReactNode {
  const { data, children: columnChildren, setup } = props;

  const { renderAsJson } = useRenderContext();

  if (renderAsJson) {
    return <RenderJson name="data" data={data} />;
  }

  const columnElements = Children.toArray(
    columnChildren,
  ) as ColumnElementType[];

  const columnOptionsMap = getOptionsFromColumnElements(columnElements);

  const table = useRef(new Model.Table(data, setup, columnOptionsMap)).current;

  return (
    <MeasureContextProvider>
      <Box flexDirection="column">
        <HeaderRow marginBottom={1} table={table} />
        <BodyRows table={table} />
      </Box>
      {columnChildren}
    </MeasureContextProvider>
  );
}
