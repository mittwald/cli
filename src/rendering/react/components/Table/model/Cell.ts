import { Row } from "./Row.js";
import { Column } from "./Column.js";
import { ColumnName } from "./ColumnName.js";

export type TableCellMapper<T> = (data: T) => string;

export interface CellDataObject<T> {
  name: string;
  data: T;
  mapper?: TableCellMapper<T>;
}

export class Cell<T> {
  public readonly name: ColumnName;
  public readonly data: unknown;
  public readonly row: Row<unknown>;

  private constructor(row: Row<unknown>, name: string, data: T) {
    this.row = row;
    this.name = new ColumnName(name);
    this.data = data;
  }

  public static fromObject<T>(
    row: Row<unknown>,
    object: CellDataObject<T>,
  ): Cell<T> {
    return new Cell(row, object.name, object.data);
  }

  public static empty(row: Row<unknown>, name: string): Cell<undefined> {
    return new Cell(row, name, undefined);
  }

  public get column(): Column {
    return this.row.table.getColumn(this.name);
  }
}
