import { formatDistanceToNow } from "date-fns";

export type DateRenderer = (d: Date | string) => string;

const forceDateType = (d: Date | string): Date => {
  if (typeof d === "string") {
    return new Date(d);
  }
  return d;
};

export const formatDateISO: DateRenderer = (d) =>
  forceDateType(d).toISOString();

export const formatDateLocale: DateRenderer = (d) =>
  forceDateType(d).toLocaleString(undefined, {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
  });

export const formatRelativeDate: DateRenderer = (date) => {
  date = forceDateType(date);

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
