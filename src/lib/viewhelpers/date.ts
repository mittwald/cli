import { formatDistanceToNow } from "date-fns";
import { maybe, OptionalFn } from "../util/maybe.js";

export type DateRenderer = (d: Date | string) => string;
export type OptionalDateRenderer = OptionalFn<DateRenderer>;

const forceDateType = (d: Date | string): Date => {
  if (typeof d === "string") {
    return new Date(d);
  }
  return d;
};

export function optionalDateRenderer(r: DateRenderer): OptionalDateRenderer {
  return maybe(r);
}

export const formatDateISO: DateRenderer = (d) =>
  forceDateType(d).toISOString();

export const formatDateLocale: DateRenderer = (d) =>
  forceDateType(d).toLocaleString();

export const formatRelativeDate: DateRenderer = (date) => {
  if (!date) {
    return "unknown";
  }

  if (typeof date === "string") {
    date = new Date(date);
  }

  if (date.getTime() < new Date().getTime()) {
    return formatDistanceToNow(date) + " ago";
  }
  return formatDistanceToNow(date) + " from now";
};

export const parseDate = (text: string): Date | undefined => {
  const time = Date.parse(text);
  if (isNaN(time)) {
    return undefined;
  }
  return new Date(time);
};

export function makeDateRendererForFormat(
  format: string,
  relative: boolean,
): DateRenderer {
  switch (format) {
    case "csv":
      return formatDateISO;
    case "json":
    case "yaml":
      return (d: Date | string) => forceDateType(d).toJSON();
    default:
      return relative ? formatRelativeDate : formatDateLocale;
  }
}
