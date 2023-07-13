import { ObservableValue } from "../../../lib/observable-value/ObservableValue.js";
import { Table } from "./Table.js";
import { Dimension } from "../../../measure/context.js";
import { ColumnOptions, ColumnOptionsInput } from "./ColumnOptions.js";
import { ColumnName } from "./ColumnName.js";

export class Column {
  public readonly table: Table;
  public readonly name: ColumnName;
  public readonly options: ColumnOptions;

  public readonly maxCellWidth = new ObservableValue(0);
  public readonly proportionalWidth = new ObservableValue("0%");

  public constructor(
    table: Table,
    name: string,
    optionsInput?: ColumnOptionsInput<any>,
  ) {
    this.table = table;
    this.name = new ColumnName(name);
    this.table.overallWidth.observe((width) =>
      this.updateProportionalWidth(width),
    );
    this.options = new ColumnOptions(this, optionsInput);
  }

  private updateProportionalWidth(overallWidth: number): void {
    const thisWidth = this.maxCellWidth.value;
    const quotient = thisWidth / overallWidth;
    const percentage = Math.floor(quotient * 100);
    this.proportionalWidth.updateValue(`${percentage}%`);
  }

  public notifyCellMeasured(dimension: Dimension): void {
    if (this.maxCellWidth.value < dimension.width) {
      this.maxCellWidth.updateValue(dimension.width);
    }
  }
}
