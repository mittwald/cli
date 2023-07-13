import { Row } from "./Row.js";
import { Column } from "./Column.js";
import { ObservableValue } from "../../../lib/observable-value/ObservableValue.js";
import { ColumnOptionsInput } from "./ColumnOptions.js";
import { TableRenderSetupOutput } from "../../../../setup/TableRenderSetup.js";
import { ColumnName } from "./ColumnName.js";

export type TableOptions = TableRenderSetupOutput;
export type TableColumnsInput<TData = unknown> = Record<
  string,
  ColumnOptionsInput<TData>
>;

export class Table<T = unknown> {
  public readonly rows: Row<T>[];
  public readonly columns: Column[];
  public readonly overallWidth = new ObservableValue(0);
  public readonly tableOptions?: TableOptions;

  public constructor(
    data: T[],
    tableOptions?: TableOptions,
    columnOptionsInput?: TableColumnsInput<T>,
  ) {
    this.tableOptions = Object.freeze(tableOptions);
    this.rows = this.buildRows(data);
    this.columns = this.buildColumns(this.rows, columnOptionsInput);
  }

  private buildRows(data: T[]): Row<T>[] {
    return data.map((item, index) => Row.fromObject(this, index, item));
  }

  private handleColumnWidthChanged(): void {
    const overallWidth = this.columns.reduce(
      (width, col) => width + col.maxCellWidth.value,
      0,
    );
    this.overallWidth.updateValue(overallWidth);
  }

  private buildColumns(
    rows: Row[],
    columnOptions?: TableColumnsInput<T>,
  ): Column[] {
    const columnsMap = new Map<string, Column>();

    const addColumn = (columnName: string): void => {
      const options = columnOptions ? columnOptions[columnName] : {};
      const column = new Column(this, columnName, options);
      columnsMap.set(columnName, column);
      column.maxCellWidth.observe(() => this.handleColumnWidthChanged());
    };

    for (const row of rows) {
      const columns = columnOptions
        ? Object.entries(columnOptions).map(([name]) => name)
        : row.collectColumnNamesFromCells().map((n) => n.value);

      for (const column of columns) {
        if (!columnsMap.has(column)) {
          addColumn(column);
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
