import { BooleanFlag, OptionFlag } from "@oclif/core/interfaces";
import { Flags, ux } from "@oclif/core";
import { PrinterFactory } from "../Printer.js";

// export type ListOptions = ux.Table.table.Options;
// export type ListColumns<TItem extends Record<string, unknown>> =
//   ux.Table.table.Columns<TItem>;

export type ListColumn<TItem> = {
  header?: string;
  extended?: boolean;
  get?: (row: TItem) => string | undefined;
  minWidth?: number;
};

export type ListColumns<TItem> = {
  [key: string]: ListColumn<TItem>;
};

// type RelevantTableBaseFlags = Partial<typeof ux.table.Flags> &
//   Pick<typeof ux.table.Flags, "output">;
type ListFormatterFlags = {
  output: OptionFlag<OutputFormat>;
  extended: BooleanFlag<boolean>;
  "no-header": BooleanFlag<boolean>;
  "no-truncate": BooleanFlag<boolean>;
  "no-relative-dates": BooleanFlag<boolean>;
};

// TODO: What was the difference between ListOptions and ListFormatterFlagsOutput?
export type ListOptions = ListFormatterFlagsOutput;

const outputFormats = ["txt", "json", "yaml", "csv"] as const;
type OutputFormat = (typeof outputFormats)[number];

type ListFormatterFlagsOutput = {
  output: OutputFormat;
  extended: boolean;
  "no-header": boolean;
  "no-truncate": boolean;
  "no-relative-dates": boolean;
};

export function isListFormatterFlags(flags: {
  [k: string]: unknown;
}): flags is ListFormatterFlagsOutput {
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

    ux.table(output, columns, {
      printLine: console.log,
      ...opts,
    });
  }
}
