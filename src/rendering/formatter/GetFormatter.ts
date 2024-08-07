import { FlagInput } from "@oclif/core/lib/interfaces/parser.js";
import { ux } from "@oclif/core";
import { DefaultPrinter, Printer, PrinterFactory } from "../Printer.js";

export interface GetOptions {
  outputFormat: string;
}

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
