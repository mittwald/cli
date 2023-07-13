import { Column } from "./Column.js";
import { ReactNode } from "react";

type CellRenderer<TData = unknown> = (data: TData) => ReactNode;

export interface ColumnOptionsInput<TData = unknown> {
  isVisible?: boolean;
  isUuid?: boolean;
  minWidth?: number;
  header?: ReactNode;
  extended?: boolean;
  render?: CellRenderer<TData>;
}

export class ColumnOptions {
  public readonly column: Column;
  public readonly input?: ColumnOptionsInput;
  public readonly minWidth: number;
  public readonly header?: ReactNode;
  public readonly isVisible: boolean;
  public readonly isExtended: boolean;
  public readonly cellRenderer?: CellRenderer;

  public constructor(column: Column, input?: ColumnOptionsInput) {
    this.column = column;
    this.input = input;
    this.minWidth = input?.minWidth ?? (input?.isUuid ? 36 : 5);
    this.header = input?.header;
    this.isExtended = input?.extended ?? false;
    this.isVisible = this.getIsVisible();
    this.cellRenderer = input?.render;
  }

  private getIsVisible(): boolean {
    if (this.input === undefined) {
      return false;
    }

    const { extended: extendTableOption, visibleColumns } =
      this.column.table.tableOptions ?? {};

    const fulfillsExtended = !this.isExtended || extendTableOption === true;

    const isHidden =
      !!visibleColumns &&
      !visibleColumns.some((name) => this.column.name.matches(name));

    return !isHidden && fulfillsExtended;
  }
}
