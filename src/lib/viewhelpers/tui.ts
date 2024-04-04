import chalk from "chalk";

export function printHeader(heading: string) {
  console.log(chalk.bold.white(heading));
  console.log(chalk.bold.white("─".repeat(heading.length)));
  console.log();
}

export function printKeyValues(tableContents: Record<string, string>) {
  const keys = Object.keys(tableContents);
  const l = Math.max(...keys.map((k) => k.length));

  for (const key of keys) {
    console.log(chalk.blueBright(key.padEnd(l, " ")), " ", tableContents[key]);
  }
}
