import { BooleanFlag, OptionFlag } from "@oclif/core/interfaces";
import { Flags } from "@oclif/core";
import { PrinterFactory } from "../Printer.js";
import { stdout } from "@oclif/core/ux";
import Table, { ListColumns } from "./Table.js";
import { getTerminalWidth } from "../lib/getTerminalWidth.js";
import TableColumnRenderer from "./TableColumnRenderer.js";
import { TableRenderer } from "./TableRenderer.js";
import TableCSVRenderer from "./TableCSVRenderer.js";

export { ListColumn, ListColumns } from "./Table.js";

type ListFormatterFlags = {
  output: OptionFlag<OutputFormat>;
  extended: BooleanFlag<boolean>;
  "no-header": BooleanFlag<boolean>;
  "no-truncate": BooleanFlag<boolean>;
  "no-relative-dates": BooleanFlag<boolean>;
  "csv-separator": OptionFlag<"," | ";">;
};

export type ListOptions = {
  output: OutputFormat;
  extended: boolean;
  "no-header": boolean;
  "no-truncate": boolean;
  "no-relative-dates": boolean;
  "csv-separator": "," | ";";
};

const outputFormats = ["txt", "json", "yaml", "csv", "tsv"] as const;
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
        description: "do not truncate output (only relevant for txt output)",
        required: false,
        default: false,
      }),
      "no-relative-dates": Flags.boolean({
        description:
          "show dates in absolute format, not relative (only relevant for txt output)",
        required: false,
        default: false,
      }),
      "csv-separator": Flags.custom<"," | ";">({
        description: "separator for CSV output (only relevant for CSV output)",
        required: false,
        default: ",",
        options: [",", ";"],
      })(),
    };
  }

  private buildTableRenderer<T>(
    opts: ListOptions | undefined,
  ): TableRenderer<T> {
    if (opts?.output === "csv") {
      return new TableCSVRenderer({
        header: !opts?.["no-header"],
        columnSeparator: opts?.["csv-separator"],
      });
    }

    if (opts?.output === "tsv") {
      return new TableCSVRenderer({
        header: !opts?.["no-header"],
        columnSeparator: "\t",
      });
    }

    return new TableColumnRenderer<T>({
      maxWidth: getTerminalWidth(),
      truncate: !opts?.["no-truncate"],
      header: !opts?.["no-header"],
    });
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

    const tableRenderer = this.buildTableRenderer(opts);

    const table = new Table(columns, tableRenderer, {
      extended: opts?.extended,
    });

    stdout(table.render(output));
  }
}
