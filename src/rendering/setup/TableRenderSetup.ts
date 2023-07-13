import { Flags } from "@oclif/core";
import { FlagSupportedSetup, InferredOutput } from "./FlagSupportedSetup.js";

interface Settings {}

export const TableRenderSetup = FlagSupportedSetup.build(
  {
    columns: Flags.string({
      exclusive: ["additional"],
      description: "only show provided columns (comma-seperated)",
    }),
    extended: Flags.boolean<boolean>({
      description: "show extra columns",
    }),
    noTruncate: Flags.boolean<boolean>({
      default: false,
      description: "do not truncate output to fit screen",
    }),
  },
  {} as Settings,
  (flags) => {
    const visibleColumns = flags.columns
      ?.split(",")
      .map((colName) => colName.trim());

    return {
      visibleColumns,
      extended: flags.extended,
      noTruncate: flags.noTruncate,
    };
  },
);

export type TableRenderSetupOutput = InferredOutput<typeof TableRenderSetup>;
