import { ObservableValue } from "../../../lib/observable-value/ObservableValue.js";
import { Table } from "./Table.js";
import { Dimension } from "../../../measure/context.js";
import { ColumnOptions, ColumnOptionsInput } from "./ColumnOptions.js";
import { ColumnName } from "./ColumnName.js";
import { useWatchObservableValue } from "../../../lib/observable-value/useWatchObservableValue.js";
import { getTerminalWidth } from "../../../../lib/getTerminalWidth.js";

export class Column {
  public readonly table: Table;
  public readonly name: ColumnName;
  public readonly options: ColumnOptions;

  public readonly maxCellWidth = new ObservableValue(0);
  private readonly proportionalWidth = new ObservableValue("0%");

  public constructor(
    table: Table,
    name: string,
    optionsInput?: ColumnOptionsInput<any>, // eslint-disable-line
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
    const percentage = Math.round(quotient * 100);
    this.proportionalWidth.updateValue(`${percentage}%`);
  }

  public onCellMeasured(dimension: Dimension): void {
    const termWidth = getTerminalWidth();

    const boundary = termWidth
      ? Math.round(termWidth / 2)
      : Number.MAX_SAFE_INTEGER;

    const boundedWidth = Math.min(dimension.width, boundary);

    if (this.maxCellWidth.value < boundedWidth) {
      this.maxCellWidth.updateValue(boundedWidth);
    }
  }

  public useWidth(): string | number {
    return useWatchObservableValue<string | number>(
      process.stdout.isTTY ? this.proportionalWidth : this.maxCellWidth,
    );
  }
}
