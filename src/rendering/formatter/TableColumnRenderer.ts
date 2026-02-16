import { TableRenderer, TableRendererOptions } from "./TableRenderer.js";
import smartPadOrTruncate from "./smartPadOrTruncate.js";
import Table, { ListColumn } from "./Table.js";
import debug from "debug";
import { Chalk, ChalkInstance, Options as ChalkOptions } from "chalk";
import stringWidth from "string-width";

const d = debug("mw:renderer:table:columns");

export interface TableColumnRendererOptions extends TableRendererOptions {
  /**
   * The maximum width of the table in characters. If columns exceed this width,
   * they will be truncated. If omitted, the table will be as wide as necessary
   * (but not wider).
   */
  maxWidth: number | undefined;

  /** Whether to truncate columns that exceed the maximum width. */
  truncate: boolean;

  /** The gap between columns in characters. */
  gap: number;

  /** Options to pass to the Chalk instance used for rendering. */
  chalkOptions: ChalkOptions;

  /**
   * When columns were truncated and some space is still left, the remaining
   * space is distributed among the columns. This factor determines how much
   * smaller columns are favored over larger columns.
   *
   * Default is 0.2.
   */
  favorSmallColumnsFactor: number;
}

const defaultOptions: TableColumnRendererOptions = {
  headerRenderer: (label: string) => label.toUpperCase(),
  maxWidth: undefined,
  truncate: true,
  header: true,
  gap: 2,
  chalkOptions: {},
  favorSmallColumnsFactor: 0.2,
};

export default class TableColumnRenderer<
  TItem,
> implements TableRenderer<TItem> {
  private opts: TableColumnRendererOptions;
  private readonly chalk: ChalkInstance;

  public constructor(opts: Partial<TableColumnRendererOptions>) {
    this.chalk = new Chalk(opts.chalkOptions);
    this.opts = {
      ...defaultOptions,
      ...opts,
    };
  }

  public render(table: Table<TItem>, data: TItem[]): string {
    const availableWidth = this.opts.maxWidth;
    const { columnsWithNames } = table;

    const reservedWidths = columnsWithNames.map(([key, spec]) =>
      minWidthForColumn(key, spec),
    );
    const initialDynamicWidths = columnsWithNames.map(
      ([, spec]) => spec.minWidth || spec.header?.length || 0,
    );

    const [renderedItems, dynamicWidths] = this.renderItems(
      table,
      initialDynamicWidths,
      data,
    );

    let definiteColWidths = [...reservedWidths];

    if (availableWidth && this.opts.truncate) {
      definiteColWidths = addColumWidths(
        definiteColWidths,
        this.widenColumnsToFitAvailableSpace(
          table,
          availableWidth,
          columnsWithNames,
          definiteColWidths,
          dynamicWidths,
        ),
      );
    } else {
      // when no maximum width is given, just use the maximum content width
      definiteColWidths.forEach((width, idx) => {
        definiteColWidths[idx] = Math.max(width, dynamicWidths[idx]);
      });
    }

    d("table options: %o", this.opts);

    d(
      "definite column widths: %o (sum: %o)",
      definiteColWidths,
      sum(definiteColWidths),
    );

    let output = "";

    const gap = " ".repeat(this.opts.gap);

    if (this.opts.header) {
      output += this.renderHeader(columnsWithNames, definiteColWidths);
    }

    for (let idx = 0; idx < renderedItems.length; idx++) {
      const truncatedRows = renderedItems[idx].map((val, idx) =>
        smartPadOrTruncate(val, definiteColWidths[idx]),
      );

      output += truncatedRows.join(gap) + "\n";
    }

    return output;
  }

  private renderItems(
    table: Table<TItem>,
    columnWidths: number[],
    data: TItem[],
  ): [string[][], number[]] {
    const renderedItems = table.extractRowValues(data);

    const newColumnWidths = columnWidths.map((w, idx) => {
      const renderedWidths = renderedItems.map((r) => stringWidth(r[idx]));
      return Math.max(w, ...renderedWidths);
    });

    return [renderedItems, newColumnWidths];
  }

  private renderHeader(
    columns: [string, ListColumn<TItem>][],
    columnWidths: number[],
  ): string {
    const headerNames = columns.map(([key, value]) => value.header ?? key);
    const renderedHeaderTitles = headerNames.map(this.opts.headerRenderer);
    const truncatedHeaderColumns = renderedHeaderTitles.map((val, idx) =>
      smartPadOrTruncate(val, columnWidths[idx]),
    );
    const dividerColumns = columnWidths.map((w) => "─".repeat(w));

    const gap = " ".repeat(this.opts.gap);

    return (
      [
        this.chalk.bold(truncatedHeaderColumns.join(gap)),
        this.chalk.bold(dividerColumns.join(gap)),
      ].join("\n") + "\n"
    );
  }

  private widenColumnsToFitAvailableSpace(
    table: Table<TItem>,
    availableWidth: number,
    columnsWithNames: [string, ListColumn<TItem>][],
    definiteColWidths: number[],
    maximumColWidths: number[],
  ): number[] {
    const totalColumnGapReservation = this.totalColumnGapReservation(table);

    const computeRemainingWidth = () =>
      availableWidth - sum(definiteColWidths) - totalColumnGapReservation;
    const remainingInitially = computeRemainingWidth();
    const expandingColumn = columnsWithNames.findIndex(
      ([_, spec]) => spec.expand,
    );
    const hasExpandingColumn = expandingColumn >= 0;

    const additionalColumnWidths = this.widenColumnsToFitTruncatedContent(
      remainingInitially,
      definiteColWidths,
      maximumColWidths,
    );

    definiteColWidths = addColumWidths(
      definiteColWidths,
      additionalColumnWidths,
    );

    const remainingAfterExpansionForTruncated = computeRemainingWidth();

    // If a column is set to expand, give it all the remaining space; otherwise,
    // distribute it proportionally to requested content width among all columns
    if (hasExpandingColumn) {
      additionalColumnWidths[expandingColumn] +=
        remainingAfterExpansionForTruncated;
      return additionalColumnWidths;
    }

    return addColumWidths(
      additionalColumnWidths,
      this.widenColumnsProportionally(
        remainingAfterExpansionForTruncated,
        columnsWithNames,
        definiteColWidths,
      ),
    );
  }

  private widenColumnsProportionally(
    remaining: number,
    columnsWithNames: [string, ListColumn<TItem>][],
    maximumColWidths: number[],
  ): number[] {
    const growableRequestedWidth = sum(
      columnsWithNames.map(([_, spec], idx) =>
        spec.exactWidth === undefined ? maximumColWidths[idx] : 0,
      ),
    );
    const growableProportions = columnsWithNames.map(([_, spec], idx) =>
      spec.exactWidth === undefined
        ? maximumColWidths[idx] / growableRequestedWidth
        : 0,
    );

    return growableProportions.map((p) => Math.floor(p * remaining));
  }

  private widenColumnsToFitTruncatedContent(
    remaining: number,
    definiteColWidths: number[],
    maximumColWidths: number[],
  ): number[] {
    const truncatedWidths = maximumColWidths.map(
      (w, idx) => w - definiteColWidths[idx],
    );
    const totalTruncated = sum(truncatedWidths);

    if (totalTruncated < remaining) {
      return truncatedWidths;
    }

    const { favorSmallColumnsFactor } = this.opts;
    const [a, b] = [1 - favorSmallColumnsFactor, favorSmallColumnsFactor];
    const availableForTruncatedContent = remaining / 2;
    const additionalSpaceForTruncatedWeights = truncatedWidths
      .map((w) => w / totalTruncated)
      .map((w) => w * a + b); // slightly favor smaller columns

    return additionalSpaceForTruncatedWeights.map((w, idx) =>
      Math.min(
        truncatedWidths[idx],
        Math.floor(w * availableForTruncatedContent),
      ),
    );
  }

  /** The total width reserved for column gaps. */
  private totalColumnGapReservation(table: Table<TItem>): number {
    return (table.columnsWithNames.length - 1) * this.opts.gap;
  }
}

function minWidthForColumn<T = unknown>(key: string, c: ListColumn<T>): number {
  return c.minWidth ?? c.exactWidth ?? c.header?.length ?? key.length;
}

function sum(x: number[]): number {
  return x.reduce((a, b) => a + b, 0);
}

function addColumWidths(x: number[], y: number[]): number[] {
  if (x.length !== y.length) {
    throw new Error("Column width arrays must have the same length");
  }
  return x.map((v, idx) => v + y[idx]);
}
