import { TableRenderer, TableRendererOptions } from "./TableRenderer.js";
import Table from "./Table.js";

export interface TableCSVRendererOptions extends TableRendererOptions {
  columnSeparator: ";" | "," | "\t";
  rowSeparator: "\r\n" | "\n";
  quote: "'" | '"';
}

const defaultOptions: TableCSVRendererOptions = {
  header: true,
  headerRenderer: (s) => s,
  quote: '"',
  columnSeparator: ",",
  rowSeparator: "\r\n",
};

export default class TableCSVRenderer<TItem> implements TableRenderer<TItem> {
  private readonly opts: TableCSVRendererOptions;

  public constructor(opts: Partial<TableCSVRendererOptions>) {
    this.opts = {
      ...defaultOptions,
      ...opts,
    };
  }

  render(table: Table<TItem>, items: TItem[]): string {
    const columns = table.columnsWithNames;
    const values = table.extractRowValues(items);
    const { header, rowSeparator, columnSeparator, quote } = this.opts;

    let output = "";

    if (header) {
      const headerNames = columns.map(([key, spec]) => spec.header ?? key);
      const headerLabels = headerNames
        .map(this.opts.headerRenderer)
        .map((v) => quoteForCSV(v, quote, columnSeparator));
      const headerRow = headerLabels.join(columnSeparator);

      output += headerRow + rowSeparator;
    }

    const rows = values.map((row) =>
      row
        .map((value) => quoteForCSV(value, quote, columnSeparator))
        .join(columnSeparator),
    );

    output += rows.join(rowSeparator);

    return output;
  }
}

function quoteForCSV(
  value: string,
  quote: "'" | '"',
  separator: string,
): string {
  if (value.includes(quote) || value.includes(separator)) {
    return quote + value.replace(quote, "\\" + quote) + quote;
  }

  return value;
}
