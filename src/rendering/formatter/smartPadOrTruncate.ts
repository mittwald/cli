import smartTruncate from "./smartTruncate.js";
import smartPad from "./smartPad.js";

export default function smartPadOrTruncate(
  str: string,
  length: number,
): string {
  return smartTruncate(smartPad(str, length), length);
}
