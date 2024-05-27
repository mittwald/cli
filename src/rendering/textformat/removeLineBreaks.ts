/**
 * Removes line breaks from a string.
 *
 * @param text
 */
export function removeLineBreaks(text: string) {
  return text.replace(/(\r\n|\n|\r)/gm, "");
}
