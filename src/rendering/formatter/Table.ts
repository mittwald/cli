import { Chalk, ChalkInstance, Options as ChalkOptions } from "chalk";
import stringWidth from "string-width";
import debug from "debug";
import smartTruncate from "./smartTruncate.js";
import smartPad from "./smartPad.js";
import smartPadOrTruncate from "./smartPadOrTruncate.js";

const d = debug("@mittwald/cli:table");

export type ListColumn<TItem> = {
  /** The header to display for this column. */
  header?: string;

  /**
   * Whether this column counts as an extended column. Extended columns are only
   * displayed when the `extended` option is set to `true`.
   */
  extended?: boolean;

  /**
   * A function to extract the value to display for this column from the item.
   * If not set, the column will be extracted from the item by its key.
   */
  get?: (row: TItem) => string | undefined;

  /**
   * The minimum width of this column. If the content is smaller, the column
   * will be padded with spaces. If the content is larger, the column might be
   * expanded based on the available remaining space, or truncated.
   */
  minWidth?: number;

  /**
   * The exact width of this column. If set, the column will be exactly this
   * wide, regardless of the content.
   */
  exactWidth?: number;

  /**
   * Whether this column should expand to fill the remaining space. Currently,
   * only one column can be set to expand.
   */
  expand?: boolean;
};

export type ListColumns<TItem> = {
  [key: string]: ListColumn<TItem>;
};

export interface TableOptions {
  /** Whether to include extended columns in the output. */
  extended: boolean;

  /** Whether to truncate columns that exceed the maximum width. */
  truncate: boolean;

  /** Whether to include a header row in the output. */
  header: boolean;

  /** The gap between columns in characters. */
  gap: number;

  /**
   * The maximum width of the table in characters. If columns exceed this width,
   * they will be truncated. If omitted, the table will be as wide as necessary
   * (but not wider).
   */
  maxWidth: number | undefined;

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

  /**
   * Renderer function for the header labels. By default, the labels are
   * uppercased.
   *
   * @param label
   */
  headerRenderer: (label: string) => string;
}

/** Default options for the table formatter. */
const defaultOptions: Readonly<TableOptions> = {
  extended: false,
  truncate: true,
  header: true,
  gap: 2,
  maxWidth: undefined,
  chalkOptions: {},
  favorSmallColumnsFactor: 0.2,
  headerRenderer: (label: string) => label.toUpperCase(),
};

function minWidthForColumn<T = unknown>(key: string, c: ListColumn<T>): number {
  return c.minWidth ?? c.exactWidth ?? c.header?.length ?? key.length;
}

function sum(x: number[]): number {
  return x.reduce((a, b) => a + b, 0);
}

export default class Table<TItem> {
  private readonly columns: ListColumns<TItem>;
  private readonly opts: TableOptions;
  private readonly chalk: ChalkInstance;

  public constructor(columns: ListColumns<TItem>, opts: Partial<TableOptions>) {
    this.columns = columns;
    this.chalk = new Chalk(opts.chalkOptions);
    this.opts = {
      ...defaultOptions,
      ...opts,
    };
  }

  private get columnsWithNames(): [string, ListColumn<TItem>][] {
    let columns = Object.entries(this.columns);

    if (!this.opts.extended) {
      columns = columns.filter(([, spec]) => !spec.extended);
    }

    return columns;
  }

  private get totalColumnGapReservation(): number {
    return (this.columnsWithNames.length - 1) * this.opts.gap;
  }

  private renderItems(
    columns: [string, ListColumn<TItem>][],
    columnWidths: number[],
    data: TItem[],
  ): [string[][], number[]] {
    const renderedItems: string[][] = [];

    for (let idx = 0; idx < data.length; idx++) {
      const rendered = columns.map(([key, spec]) => {
        if (spec.get) {
          return spec.get(data[idx]) ?? "";
        }

        const value = (data[idx] as any)[key] ?? "";
        return String(value);
      });

      renderedItems.push(rendered);
    }

    const newColumnWidths = columnWidths.map((w, idx) => {
      const renderedWidths = renderedItems.map((r) => stringWidth(r[idx]));
      return Math.max(w, ...renderedWidths);
    });

    return [renderedItems, newColumnWidths];
  }

  public render(data: TItem[]): string {
    const availableWidth = this.opts.maxWidth;
    const { totalColumnGapReservation, columnsWithNames } = this;

    const reservedWidths = columnsWithNames.map(([key, spec]) =>
      minWidthForColumn(key, spec),
    );
    const initialDynamicWidths = columnsWithNames.map(
      ([, spec]) => spec.minWidth || spec.header?.length || 0,
    );

    const [renderedItems, dynamicWidths] = this.renderItems(
      columnsWithNames,
      initialDynamicWidths,
      data,
    );

    const definiteColWidths = [...reservedWidths];
    const truncatedWidths = dynamicWidths.map(
      (w, idx) => w - definiteColWidths[idx],
    );

    if (availableWidth) {
      let remaining =
        availableWidth - sum(definiteColWidths) - totalColumnGapReservation;
      const expandingColumn = columnsWithNames.findIndex(
        ([_, spec]) => spec.expand,
      );
      const totalTruncated = sum(truncatedWidths);

      if (totalTruncated < remaining) {
        for (let i = 0; i < definiteColWidths.length; i++) {
          definiteColWidths[i] += truncatedWidths[i];
        }
      } else {
        const { favorSmallColumnsFactor } = this.opts;
        const [a, b] = [1 - favorSmallColumnsFactor, favorSmallColumnsFactor];
        const availableForTruncatedContent = remaining / 2;
        const additionalSpaceForTruncatedWeights = truncatedWidths
          .map((w) => w / totalTruncated)
          .map((w) => w * a + b); // slightly favor smaller columns
        const additionalSpaceForTruncated =
          additionalSpaceForTruncatedWeights.map((w, idx) =>
            Math.min(
              truncatedWidths[idx],
              Math.floor(w * availableForTruncatedContent),
            ),
          );

        for (let i = 0; i < definiteColWidths.length; i++) {
          definiteColWidths[i] += additionalSpaceForTruncated[i];
        }
      }

      remaining =
        availableWidth - sum(definiteColWidths) - totalColumnGapReservation;

      if (expandingColumn >= 0) {
        definiteColWidths[expandingColumn] += remaining;
      } else {
        const growableRequestedWidth = sum(
          columnsWithNames.map(([_, spec], idx) =>
            spec.exactWidth === undefined ? dynamicWidths[idx] : 0,
          ),
        );
        const growableProportions = columnsWithNames.map(([_, spec], idx) =>
          spec.exactWidth === undefined
            ? dynamicWidths[idx] / growableRequestedWidth
            : 0,
        );
        const growableChars = growableProportions.map((p) =>
          Math.floor(p * remaining),
        );

        growableChars.forEach((chars, idx) => {
          definiteColWidths[idx] += chars;
        });
      }
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
}
