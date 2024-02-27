import { createContext, useContext } from "react";
import { TableRenderSetupOutput } from "../../../setup/TableRenderSetup.js";

interface TableContext {
  setup: TableRenderSetupOutput;
}

export const buildTableContext = (
  ctx: Partial<TableContext> = {},
): TableContext =>
  ({
    ...ctx,
  }) as TableContext;

const context = createContext<TableContext>(buildTableContext());

export const useTableContext = (): TableContext => useContext(context);

export const TableContextProvider = context.Provider;
