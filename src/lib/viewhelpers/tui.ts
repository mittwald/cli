import chalk from "chalk";

export function printHeader(title: string): void {
  console.log(chalk.bold.white(title));
  console.log(chalk.bold.white("─".repeat(title.length)));
  console.log();
}

export function printKeyValues(input: Record<string, string>): void {
  const keys = Object.keys(input);
  const maxKeyLength = Math.max(...keys.map((k) => k.length));

  for (const key of keys) {
    console.log(
      chalk.blueBright(key.padEnd(maxKeyLength, " ")),
      " ",
      input[key],
    );
  }
}
