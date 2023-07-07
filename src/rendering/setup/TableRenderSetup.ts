import { Flags } from "@oclif/core";
import { ComponentProps } from "react";
import { Table } from "../react/components/Table.js";
import { FlagSupportedSetup } from "./FlagSupportedSetup.js";

export type Output = Partial<ComponentProps<typeof Table>>;

export const TableRenderSetup = FlagSupportedSetup.build(
  {
    columns: Flags.string({
      multiple: true,
    }),
  },
  {
    columns: ["id", "description"],
  },
  (flags) => ({
    columns: flags.columns,
  }),
);
