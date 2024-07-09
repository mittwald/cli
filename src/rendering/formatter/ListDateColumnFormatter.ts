import {
  DateRenderer,
  formatDateISO,
  makeDateRendererForFormat,
} from "../textformat/formatDate.js";
import { isListFormatterFlags, ListColumn } from "./ListFormatter.js";

type ResourceWithCreatedAt = {
  createdAt: string;
};

export function isResourceWithCreatedAt(
  resource: Record<string, unknown>,
): resource is ResourceWithCreatedAt {
  return "createdAt" in resource;
}

/**
 * ListDateColumnFormatter is a helper class to create a column for a list
 * formatter that can handle date formatting.
 */
export default class ListDateColumnFormatter {
  public constructor(private readonly flags: { [k: string]: unknown }) {}

  public get renderDate(): DateRenderer {
    if (isListFormatterFlags(this.flags)) {
      return makeDateRendererForFormat(
        this.flags.output,
        !this.flags["no-relative-dates"],
      );
    }
    return formatDateISO;
  }

  public buildColumn<TColumnName extends string = "createdAt">({
    header = "Created at",
    fallback = "unknown",
    column = "createdAt" as const,
    extended = false,
  }: {
    header?: string;
    fallback?: string;
    column?: TColumnName | "createdAt";
    extended?: boolean;
  } = {}): ListColumn<{ [k: string]: unknown }> {
    return {
      header,
      extended,
      get: (row) =>
        row[column] ? this.renderDate(new Date(`${row[column]}`)) : fallback,
    };
  }
}
