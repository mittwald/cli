import { useStdout } from "ink";

// Increase Inks default column width for non-TTY of 80
export const useIncreaseInkStdoutColumns = (): void => {
  // Ink types this as a generic NodeJS.WritableStream, but it is process.stdout
  // (or another tty.WriteStream) at runtime.
  const stdout = useStdout().stdout as NodeJS.WriteStream;

  if (!stdout.isTTY) {
    // Not using Number.MAX_SAFE_INTEGER here because Ink will fail otherwise
    stdout.columns = 100_000;
  }
};
