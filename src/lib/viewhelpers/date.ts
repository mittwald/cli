import { formatDistanceToNow } from "date-fns";

export function formatRelativeDate(date: Date | string | undefined): string {
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
}

export function formatCreatedAt(row: { createdAt: string }): string {
  return formatRelativeDate(new Date(`${row.createdAt}`));
}

export const parseDate = (text: string): Date | undefined => {
  const time = Date.parse(text);
  if (isNaN(time)) {
    return undefined;
  }
  return new Date(time);
};
