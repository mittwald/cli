import chalk from "chalk";
import stringWidth from "string-width";
import { getTerminalWidth } from "../lib/getTerminalWidth.js";

export type ListColumn<TItem> = {
  header?: string;
  extended?: boolean;
  get?: (row: TItem) => string | undefined;
  minWidth?: number;
  exactWidth?: number;
  expand?: boolean;
};

export type ListColumns<TItem> = {
  [key: string]: ListColumn<TItem>;
};

export interface TableOptions {
  extended: boolean;
  truncate: boolean;
  header: boolean;
  gap: number;
  maxWidth: number | undefined;
}

function minWidthForColumn<T = unknown>(key: string, c: ListColumn<T>): number {
  return c.minWidth ?? c.exactWidth ?? c.header?.length ?? key.length;
}

function sum(x: number[]): number {
  return x.reduce((a, b) => a + b, 0);
}

function smartTruncate(str: string, length: number): string {
  const overlength = stringWidth(str) - length;

  if (overlength <= 0) {
    return str;
  }

  return str + "\b".repeat(overlength + 1) + "…" + " ".repeat(overlength) + "\b".repeat(overlength);
}

export default class Table<TItem> {
  private columns: ListColumns<TItem>;
  private opts: TableOptions;

  public constructor(columns: ListColumns<TItem>, opts: Partial<TableOptions>) {
    this.columns = columns;
    this.opts = {
      extended: false,
      truncate: true,
      header: true,
      gap: 2,
      maxWidth: undefined,
      ...opts,
    }
  }

  public render(data: TItem[]): string {
    const availableWidth = this.opts.maxWidth;
    const renderedItems: string[][] = [];

    const colList = Object.entries(this.columns).filter(([, spec]) => this.opts.extended ? true : !spec.extended);

    const reservedWidths = colList.map(([key, spec]) => minWidthForColumn(key, spec));
    const dynamicWidths = colList.map(([, spec]) => spec.minWidth || spec.header?.length || 0);
    const reservedForColumnGaps = (colList.length - 1) * this.opts.gap;

    for (let idx = 0; idx < data.length; idx++) {
      const rendered = colList.map(([key, spec]) => {
        if (spec.get) {
          return spec.get(data[idx]);
        }
        return (data[idx] as any)[key];
      });

      rendered.forEach((val, idx) => {
        dynamicWidths[idx] = Math.max(dynamicWidths[idx], colList[idx][1].minWidth ? 0 : stringWidth(val));
      });

      renderedItems.push(rendered);
    }

    const definiteColWidths = [...reservedWidths];

    if (availableWidth) {
      const remaining = availableWidth - sum(definiteColWidths) - reservedForColumnGaps;
      const expandingColumn = colList.findIndex(([_, spec]) => spec.expand);

      if (expandingColumn >= 0) {
        definiteColWidths[expandingColumn] += remaining;
      } else {
        const growableRequestedWidth = sum(colList.map(([_, spec], idx) => spec.exactWidth === undefined ? dynamicWidths[idx] : 0));
        const growableProportions = colList.map(([_, spec], idx) => spec.exactWidth === undefined ? dynamicWidths[idx] / growableRequestedWidth : 0);
        const growableChars = growableProportions.map(p => Math.floor(p * remaining));

        growableChars.forEach((chars, idx) => {
          definiteColWidths[idx] += chars;
        });
      }
    }

    let output = "";

    const headerColumns = colList.map(([key, value]) => (value.header ?? key).toUpperCase());
    const truncatedHeaderColumns = headerColumns.map((val, idx) => val.substring(0, definiteColWidths[idx]));
    const paddedHeaderColumns = truncatedHeaderColumns.map((val, idx) => val + " ".repeat(definiteColWidths[idx] - stringWidth(val)));

    const gap = " ".repeat(this.opts.gap);

    if (this.opts.header) {
      output += chalk.bold(paddedHeaderColumns.join(gap)) + "\n";
      output += chalk.bold(paddedHeaderColumns.map(v => "─".repeat(v.length)).join(gap)) + "\n";
    }

    for (let idx = 0; idx < renderedItems.length; idx++) {
      const truncatedRows = renderedItems[idx].map((val, colIdx) => smartTruncate(val, definiteColWidths[colIdx]));
      const paddedRows = truncatedRows.map((val, colIdx) => val + " ".repeat(Math.max(0, definiteColWidths[colIdx] - stringWidth(val))));

      output += paddedRows.join(gap) + "\n";
    }

    return output;
  }
}