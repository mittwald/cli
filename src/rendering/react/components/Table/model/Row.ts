import { Cell } from "./Cell.js";
import { Table } from "./Table.js";

import { ColumnName } from "./ColumnName.js";

export class Row<T> {
  public readonly table: Table<T>;
  public readonly cells: Cell<unknown>[];

  private constructor(table: Table<T>, object: T) {
    this.table = table;
    this.cells = this.buildCells(object);
  }

  public static fromObject<T>(table: Table<T>, object: T): Row<T> {
    return new Row<T>(table, object);
  }

  private buildCells<T>(object: T): Cell<T>[] {
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

  public getCell(name: string | ColumnName): Cell<unknown> {
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
