import chalk from "chalk";

/**
 * Prints a header with a predefined style.
 *
 * @deprecated Use React components instead!
 * @param heading
 */
export function printHeader(heading: string) {
  console.log(chalk.bold.white(heading));
  console.log(chalk.bold.white("─".repeat(heading.length)));
  console.log();
}
