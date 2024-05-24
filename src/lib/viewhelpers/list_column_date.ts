import { FlagOutput } from "@oclif/core/lib/interfaces/parser.js";
import {
  DateRenderer,
  formatDateISO,
  formatRelativeDate,
  makeDateRendererForFormat,
} from "./date.js";
import { table } from "@oclif/core/lib/cli-ux/styled/table.js";
import { isListFormatterFlags } from "../../rendering/ListFormatter.js";
import Column = table.Column;

type ResourceWithCreatedAt = {
  createdAt: string;
};

export function isResourceWithCreatedAt(
  resource: Record<string, unknown>,
): resource is ResourceWithCreatedAt {
  return "createdAt" in resource;
}

export function makeDateRendererForFlags(flags: FlagOutput): DateRenderer {
  if (isListFormatterFlags(flags)) {
    return makeDateRendererForFormat(flags.output, !flags["no-relative-dates"]);
  }
  return formatDateISO;
}

export function buildCreatedAtColumn(
  flags: FlagOutput,
): Partial<Column<Record<string, unknown>>> {
  const dateFormatter = makeDateRendererForFlags(flags);

  return {
    header: "Created at",
    get: (row) => dateFormatter(new Date(`${row.createdAt}`)),
  };
}

export function formatCreatedAt(row: { createdAt: string }): string {
  return formatRelativeDate(new Date(`${row.createdAt}`));
}
