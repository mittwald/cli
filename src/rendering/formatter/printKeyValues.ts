import chalk from "chalk";

/**
 * Prints a list of key-value pairs.
 *
 * @deprecated Use React components instead!
 * @param tableContents
 */
export function printKeyValues(tableContents: Record<string, string>) {
  const keys = Object.keys(tableContents);
  const l = Math.max(...keys.map((k) => k.length));

  for (const key of keys) {
    console.log(chalk.blueBright(key.padEnd(l, " ")), " ", tableContents[key]);
  }
}
