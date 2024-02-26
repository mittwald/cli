import {
  BooleanFlag,
  FlagInput,
  FlagOutput,
  OptionFlag,
} from "@oclif/core/lib/interfaces/parser.js";
import { Flags, ux } from "@oclif/core";
import { DefaultPrinter, Printer, PrinterFactory } from "./Printer.js";

export interface GetOptions {
  outputFormat: string;
}

export type ListOptions = ux.Table.table.Options;
export type ListColumns<TItem extends Record<string, unknown>> =
  ux.Table.table.Columns<TItem>;

export class GetFormatter<T = unknown> {
  public static get flags(): FlagInput {
    return {
      output: {
        ...ux.table.flags().output,
        options: ["json", "yaml"],
        char: "o",
      },
    };
  }

  private defaultPrinter: Printer<T> = new DefaultPrinter();

  public constructor(defaultPrinter: Printer<T> = new DefaultPrinter()) {
    this.defaultPrinter = defaultPrinter;
  }

  public log(output: T, opts?: GetOptions): void {
    PrinterFactory.build(opts?.outputFormat, this.defaultPrinter).log(output);
  }
}

type RelevantTableBaseFlags = Partial<typeof ux.table.Flags> &
  Pick<typeof ux.table.Flags, "output">;
type ListFormatterFlags = RelevantTableBaseFlags & {
  "relative-dates": BooleanFlag<boolean>;
};

type ListFormatterFlagsOutput = { output: string; "relative-dates": boolean };

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
      "relative-dates": Flags.boolean({
        description: "Show dates relative to now.",
        required: true,
        default: true,
        allowNo: true,
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
