import { Row } from "./Row.js";
import { Column } from "./Column.js";
import { ObservableValue } from "../../../lib/observable-value/ObservableValue.js";
import { ColumnOptionsInput } from "./ColumnOptions.js";
import { TableRenderSetupOutput } from "../../../../setup/TableRenderSetup.js";
import { ColumnName } from "./ColumnName.js";

export type TableOptions = TableRenderSetupOutput;
export type ColumnOptionsInputMap = Record<string, ColumnOptionsInput>;

export class Table<T> {
  public readonly rows: Row<T>[];
  public readonly columns: Column[];
  public readonly overallWidth = new ObservableValue(0);
  public readonly tableOptions?: TableOptions;

  public constructor(
    data: T[],
    tableOptions?: TableOptions,
    columnOptionsInput?: ColumnOptionsInputMap,
  ) {
    this.tableOptions = Object.freeze(tableOptions);
    this.rows = this.buildRows(data);
    this.columns = this.buildColumns(this.rows, columnOptionsInput);
  }

  private buildRows<T>(data: T[]): Row<T>[] {
    return data.map((d) => Row.fromObject<T>(this, d));
  }

  private handleColumnWidthChanged(): void {
    const overallWidth = this.columns.reduce(
      (width, col) => width + col.maxCellWidth.value,
      0,
    );
    this.overallWidth.updateValue(overallWidth);
  }

  private buildColumns<T>(
    rows: Row<T>[],
    columnOptions?: ColumnOptionsInputMap,
  ): Column[] {
    const columnsMap = new Map<string, Column>();

    const addColumn = (columnName: string): void => {
      const options = columnOptions?.[columnName];
      const column = new Column(this, columnName, options);
      columnsMap.set(columnName, column);
      column.maxCellWidth.observe(() => this.handleColumnWidthChanged());
    };

    for (const row of rows) {
      const names = columnOptions
        ? Object.entries(columnOptions).map(([name]) => name)
        : row.collectColumnNamesFromCells().map((n) => n.value);

      for (const name of names) {
        if (!columnsMap.has(name)) {
          addColumn(name);
        }
      }
    }

    return Array.from(columnsMap.values());
  }

  public getColumn(name: ColumnName | string): Column {
    const col = this.columns.find((col) => col.name.matches(name));

    if (!col) {
      throw new Error(`Could not get column with ID ${name}`);
    }

    return col;
  }
}
