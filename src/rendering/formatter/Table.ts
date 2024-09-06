import debug from "debug";
import TableRenderer, { TableRendererOptions } from "./TableRenderer.js";

const d = debug("mw:renderer:table");

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
}

/** Default options for the table formatter. */
const defaultOptions: Readonly<TableOptions> = {
  extended: false,
};

export default class Table<TItem> {
  private readonly columns: ListColumns<TItem>;
  private readonly opts: TableOptions;
  private readonly renderer: TableRenderer<TItem>;

  public constructor(
    columns: ListColumns<TItem>,
    renderer: TableRenderer<TItem>,
    opts: Partial<TableOptions> = {},
  ) {
    this.columns = columns;
    this.renderer = renderer;
    this.opts = {
      ...defaultOptions,
      ...opts,
    };
  }

  public render(data: TItem[]): string {
    return this.renderer.render(this, data);
  }

  /** The columns with their names as an array of tuples. */
  public get columnsWithNames(): [string, ListColumn<TItem>][] {
    let columns = Object.entries(this.columns);

    if (!this.opts.extended) {
      columns = columns.filter(([, spec]) => !spec.extended);
    }

    return columns;
  }

  public extractRowValues(data: TItem[]): string[][] {
    const columns = this.columnsWithNames;
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

    return renderedItems;
  }
}
