import { Row } from "./Row.js";
import { Column } from "./Column.js";
import { ColumnName } from "./ColumnName.js";

export type TableCellMapper<T> = (data: T) => string;

export interface CellDataObject<T> {
  name: string;
  data: T;
  mapper?: TableCellMapper<T>;
}

export class Cell<T = unknown> {
  public readonly name: ColumnName;
  private readonly data: unknown;
  public readonly row: Row;

  private constructor(row: Row, name: string, data: T) {
    this.row = row;
    this.name = new ColumnName(name);
    this.data = data;
  }

  public static fromObject<T>(row: Row, object: CellDataObject<T>): Cell<T> {
    return new Cell(row, object.name, object.data);
  }

  public static empty(row: Row, name: string): Cell<undefined> {
    return new Cell(row, name, undefined);
  }

  public get column(): Column {
    return this.row.table.getColumn(this.name);
  }

  public getData(): unknown {
    const renderer = this.column.options.cellRenderer;
    return renderer ? renderer(this.row.data) : this.data;
  }
}
