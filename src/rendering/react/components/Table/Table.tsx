import * as Model from "./model/index.js";
import { TableColumnsInput } from "./model/index.js";
import React, { ReactNode, useRef } from "react";
import { Box } from "ink";
import { useRenderContext } from "../../context.js";
import { RenderJson } from "../../json/RenderJson.js";
import { MeasureContextProvider } from "../../measure/MeasureContextProvider.js";
import { HeaderRow } from "./HeaderRow.js";
import { BodyRows } from "./BodyRows.js";
import { TableRenderSetupOutput } from "../../../setup/TableRenderSetup.js";
import { buildTableContext, TableContextProvider } from "./context.js";

interface Props<TData> {
  data: TData[];
  setup: TableRenderSetupOutput;
  columns?: TableColumnsInput<TData>;
}

export function Table<TData>(props: Props<TData>): ReactNode {
  const { data, columns, setup } = props;

  const { renderAsJson } = useRenderContext();

  if (renderAsJson) {
    return <RenderJson name="data" data={data} />;
  }

  const table = useRef(new Model.Table(data, setup, columns)).current;

  return (
    <TableContextProvider
      value={buildTableContext({
        setup,
      })}
    >
      <MeasureContextProvider>
        <Box flexDirection="column">
          <HeaderRow marginBottom={1} table={table} />
          <BodyRows table={table} />
        </Box>
      </MeasureContextProvider>
    </TableContextProvider>
  );
}
