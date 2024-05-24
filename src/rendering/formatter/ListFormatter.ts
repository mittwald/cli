import { BooleanFlag, FlagOutput } from "@oclif/core/lib/interfaces/parser.js";
import { Flags, ux } from "@oclif/core";
import { PrinterFactory } from "../Printer.js";

export type ListOptions = ux.Table.table.Options;
export type ListColumns<TItem extends Record<string, unknown>> =
  ux.Table.table.Columns<TItem>;

type RelevantTableBaseFlags = Partial<typeof ux.table.Flags> &
  Pick<typeof ux.table.Flags, "output">;
type ListFormatterFlags = RelevantTableBaseFlags & {
  "no-relative-dates": BooleanFlag<boolean>;
};

type ListFormatterFlagsOutput = {
  output: string;
  "no-relative-dates": boolean;
};

export function isListFormatterFlags(
  flags: FlagOutput,
): flags is ListFormatterFlagsOutput {
  return "output" in flags;
}

export class ListFormatter {
  public static get flags(): ListFormatterFlags {
    const tableFlags: RelevantTableBaseFlags = ux.table.flags();

    delete tableFlags.sort;
    delete tableFlags.filter;

    return {
      ...tableFlags,
      output: {
        ...tableFlags.output,
        options: ["txt", "json", "yaml", "csv"],
        char: "o",
        default: "txt",
      },
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
