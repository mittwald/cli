import { stdout } from "@oclif/core";

export const getTerminalWidth = (): number | undefined =>
  stdout.isTTY ? stdout.getWindowSize()[0] : undefined;
