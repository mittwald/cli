import { BooleanFlag, OptionFlag } from "@oclif/core/interfaces";
import { Flags, ux } from "@oclif/core";
import { PrinterFactory } from "../Printer.js";
import { render } from "ink";
import { Table } from "../react/components/Table/Table.js";
import { TableRenderSetup } from "../setup/TableRenderSetup.js";
import { ColumnOptionsInput } from "../react/components/Table/model/ColumnOptions.js";
import { TableContextProvider } from "../react/components/Table/context.js";
import { RenderContextProvider } from "../react/context.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";

export type ListColumn<TItem> = {
  header?: string;
  extended?: boolean;
  get?: (row: TItem) => string | undefined;
  minWidth?: number;
};

export type ListColumns<TItem> = {
  [key: string]: ListColumn<TItem>;
};

type ListFormatterFlags = {
  output: OptionFlag<OutputFormat>;
  extended: BooleanFlag<boolean>;
  "no-header": BooleanFlag<boolean>;
  "no-truncate": BooleanFlag<boolean>;
  "no-relative-dates": BooleanFlag<boolean>;
};

export type ListOptions = {
  output: OutputFormat;
  extended: boolean;
  "no-header": boolean;
  "no-truncate": boolean;
  "no-relative-dates": boolean;
};

const outputFormats = ["txt", "json", "yaml", "csv"] as const;
type OutputFormat = (typeof outputFormats)[number];

export function isListFormatterFlags(flags: {
  [k: string]: unknown;
}): flags is ListOptions {
  return "output" in flags;
}

export class ListFormatter {
  public static get flags(): ListFormatterFlags {
    return {
      output: Flags.option({
        required: true,
        description: "output in a more machine friendly format",
        options: outputFormats,
        char: "o",
        default: "txt",
        multiple: false,
      })(),
      extended: Flags.boolean({
        description: "show extended information",
        char: "x",
        required: false,
        default: false,
      }),
      "no-header": Flags.boolean({
        description: "hide table header",
        required: false,
        default: false,
      }),
      "no-truncate": Flags.boolean({
        description: "do not truncate output",
        required: false,
        default: false,
      }),
      "no-relative-dates": Flags.boolean({
        description: "show dates in absolute format, not relative",
        required: false,
        default: false,
      }),
    };
  }

  public log<T extends Record<string, unknown>>(
    output: T[],
    columns: ListColumns<T>,
    opts?: ListOptions,
  ): void {
    if (opts?.output === "json" || opts?.output === "yaml") {
      PrinterFactory.build(opts.output).log(output);
      return;
    }

    if (output.length === 0) {
      return;
    }

    const setup = new TableRenderSetup().getSetup({
      columns: undefined,
      noTruncate: opts?.["no-truncate"] ?? false,
      extended: opts?.extended ?? false,
      json: false,
    });

    const reactColumns = Object.fromEntries(Object.keys(columns).map((key): [string, ColumnOptionsInput<T>] => {
      const col = columns[key];
      return [key, {
        header: col.header ?? key,
        minWidth: col.minWidth,
        extended: col.extended,
        render(data) {
          if (col.get) {
            return col.get(data);
          }
          return (data as any)[key];
        }
      }]
    }));

    render(
      <RenderContextProvider value={{renderAsJson: false, apiClient: null as unknown as MittwaldAPIV2Client }}>
        <Table data={output} setup={setup} columns={reactColumns} />
      </RenderContextProvider>
    );
  }
}
