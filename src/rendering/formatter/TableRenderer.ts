import Table from "./Table.js";

export interface TableRendererOptions {
  /**
   * Renderer function for the header labels. By default, the labels are
   * uppercased.
   *
   * @param label
   */
  headerRenderer: (label: string) => string;

  /** Whether to include a header row in the output. */
  header: boolean;
}

export interface TableRenderer<TItem> {
  render(table: Table<TItem>, items: TItem[]): string;
}
