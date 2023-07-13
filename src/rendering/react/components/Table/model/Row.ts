import { Cell } from "./Cell.js";
import { Table } from "./Table.js";

import { ColumnName } from "./ColumnName.js";

export class Row<T = unknown> {
  public readonly table: Table<T>;
  public readonly cells: Cell[];
  public readonly data: T;
  public readonly index: number;

  private constructor(table: Table<T>, index: number, dataItem: T) {
    this.table = table;
    this.index = index;
    this.cells = this.buildCells(dataItem);
    this.data = dataItem;
  }

  public static fromObject<T>(
    table: Table<T>,
    index: number,
    dataItem: T,
  ): Row<T> {
    return new Row<T>(table, index, dataItem);
  }

  private buildCells<T>(object: T): Cell[] {
    if (typeof object === "object" && object !== null) {
      const entries = Object.entries(object);
      return entries.map(([name, data]) =>
        Cell.fromObject(this, {
          name,
          data,
        }),
      );
    }

    return [];
  }

  public getCell(name: string | ColumnName): Cell {
    const cell = this.cells.find((c) => c.name.matches(name));

    if (!cell) {
      return Cell.empty(this, ColumnName.getNameValue(name));
    }

    return cell;
  }

  public collectColumnNamesFromCells(): ColumnName[] {
    return this.cells.map((cell) => cell.name);
  }
}
