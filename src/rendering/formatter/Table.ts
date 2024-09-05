import { Chalk, ChalkInstance, Options as ChalkOptions } from "chalk";
import stringWidth from "string-width";
import debug from "debug";
import smartTruncate from "./smartTruncate.js";

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

  public render(data: TItem[]): string {
    const availableWidth = this.opts.maxWidth;
    const renderedItems: string[][] = [];

    const colList = Object.entries(this.columns).filter(([, spec]) =>
      this.opts.extended ? true : !spec.extended,
    );

    const reservedWidths = colList.map(([key, spec]) =>
      minWidthForColumn(key, spec),
    );
    const dynamicWidths = colList.map(
      ([, spec]) => spec.minWidth || spec.header?.length || 0,
    );
    const reservedForColumnGaps = (colList.length - 1) * this.opts.gap;

    for (let idx = 0; idx < data.length; idx++) {
      const rendered = colList.map(([key, spec]) => {
        if (spec.get) {
          return spec.get(data[idx]);
        }
        return (data[idx] as any)[key];
      });

      rendered.forEach((val, idx) => {
        dynamicWidths[idx] = Math.max(
          dynamicWidths[idx],
          colList[idx][1].minWidth ? 0 : stringWidth(val),
        );
      });

      renderedItems.push(rendered);
    }

    const definiteColWidths = [...reservedWidths];
    const truncatedWidths = dynamicWidths.map(
      (w, idx) => w - definiteColWidths[idx],
    );

    if (availableWidth) {
      let remaining =
        availableWidth - sum(definiteColWidths) - reservedForColumnGaps;
      const expandingColumn = colList.findIndex(([_, spec]) => spec.expand);
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
        availableWidth - sum(definiteColWidths) - reservedForColumnGaps;

      if (expandingColumn >= 0) {
        definiteColWidths[expandingColumn] += remaining;
      } else {
        const growableRequestedWidth = sum(
          colList.map(([_, spec], idx) =>
            spec.exactWidth === undefined ? dynamicWidths[idx] : 0,
          ),
        );
        const growableProportions = colList.map(([_, spec], idx) =>
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

    const headerColumns = colList.map(([key, value]) =>
      (value.header ?? key).toUpperCase(),
    );
    const truncatedHeaderColumns = headerColumns.map((val, idx) =>
      val.substring(0, definiteColWidths[idx]),
    );
    const paddedHeaderColumns = truncatedHeaderColumns.map(
      (val, idx) => val + " ".repeat(definiteColWidths[idx] - stringWidth(val)),
    );

    const gap = " ".repeat(this.opts.gap);

    if (this.opts.header) {
      output += this.chalk.bold(paddedHeaderColumns.join(gap)) + "\n";
      output +=
        this.chalk.bold(
          paddedHeaderColumns.map((v) => "─".repeat(v.length)).join(gap),
        ) + "\n";
    }

    for (let idx = 0; idx < renderedItems.length; idx++) {
      const truncatedRows = renderedItems[idx].map((val, colIdx) =>
        smartTruncate(val, definiteColWidths[colIdx]),
      );
      const paddedRows = truncatedRows.map(
        (val, colIdx) =>
          val +
          " ".repeat(Math.max(0, definiteColWidths[colIdx] - stringWidth(val))),
      );

      output += paddedRows.join(gap) + "\n";
    }

    return output;
  }
}
