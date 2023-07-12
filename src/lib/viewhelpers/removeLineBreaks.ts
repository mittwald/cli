export const removeLineBreaks = (text: string): string =>
  text.replace(/(\r\n|\n|\r)/gm, "");
