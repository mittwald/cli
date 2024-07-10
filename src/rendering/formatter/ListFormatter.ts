import { BooleanFlag, OptionFlag } from "@oclif/core/interfaces";
import { Flags } from "@oclif/core";
import { PrinterFactory } from "../Printer.js";
import { stdout } from "@oclif/core/ux";
import Table, { ListColumns } from "./Table.js";

export { ListColumn, ListColumns } from "./Table.js";

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

    const table = new Table(
      columns,
      {
        extended: opts?.extended,
        truncate: !opts?.["no-truncate"],
      }
    );

    stdout(table.render(output));
  }
}
