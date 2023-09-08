import { useStdout } from "ink";

// Increase Inks default column width for non-TTY of 80
export const useIncreaseInkStdoutColumns = (): void => {
  const stdout = useStdout().stdout;

  if (!stdout.isTTY) {
    // Not using Number.MAX_SAFE_INTEGER here because Ink will fail otherwise
    stdout.columns = 100_000;
  }
};
