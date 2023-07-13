import { stdout } from "@oclif/core";

export const getTerminalWidth = (): number =>
  stdout.isTTY ? stdout.getWindowSize()[0] : 80;
