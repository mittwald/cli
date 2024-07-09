import { FlagInput } from "@oclif/core/interfaces";
import { Flags } from "@oclif/core";
import { Printer, PrinterFactory, YamlPrinter } from "../Printer.js";

const outputFormats = ["txt", "json", "yaml"] as const;
type OutputFormat = (typeof outputFormats)[number];

export interface GetOptions {
  outputFormat: OutputFormat;
}

export class GetFormatter<T = unknown> {
  public static get flags(): FlagInput {
    return {
      output: Flags.option({
        required: true,
        description: "output in a more machine friendly format",
        options: outputFormats,
        char: "o",
        default: "txt",
        multiple: false,
      })(),
    };
  }

  private defaultPrinter: Printer<T> = new YamlPrinter();

  public constructor(defaultPrinter: Printer<T> = new YamlPrinter()) {
    this.defaultPrinter = defaultPrinter;
  }

  public log(output: T, opts?: GetOptions): void {
    PrinterFactory.build(opts?.outputFormat, this.defaultPrinter).log(output);
  }
}
