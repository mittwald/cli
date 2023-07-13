import { FlagInput } from "@oclif/core/lib/interfaces/parser.js";
import { ux } from "@oclif/core";
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

export class ListFormatter {
  public static get flags(): FlagInput {
    return {
      ...ux.table.flags(),
    };
  }

  public log<T extends Record<string, unknown>>(
    output: T[],
    columns: ListColumns<T>,
    opts?: ListOptions,
  ): void {
    ux.table(output, columns, {
      printLine: console.log,
      ...opts,
    });
  }
}
