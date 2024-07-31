/**
 * Get the width of the terminal, if available.
 *
 * @returns The with of the terminal in characters; undefined if process is not
 *   attached to a TTY
 */
export function getTerminalWidth(): number | undefined {
  return process.stdout.isTTY ? process.stdout.getWindowSize()[0] : undefined;
}
