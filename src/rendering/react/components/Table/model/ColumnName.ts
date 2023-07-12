import humanizeString from "humanize-string";

export class ColumnName {
  public readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public matches(name: string | ColumnName): boolean {
    return (
      this.value.toLowerCase().trim() ===
      ColumnName.getNameValue(name).toLowerCase().trim()
    );
  }

  public getHumanizedName(): string {
    return humanizeString(this.value);
  }

  public static getNameValue(name: string | ColumnName): string {
    return name instanceof ColumnName ? name.value : name;
  }
}
