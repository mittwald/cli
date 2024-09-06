import stringWidth from "string-width";
import sliceAnsi from "slice-ansi";

export default function smartTruncate(str: string, length: number): string {
  const overlength = stringWidth(str) - length;

  if (overlength <= 0) {
    return str;
  }

  return sliceAnsi(str, 0, length - 1) + "…";
}
