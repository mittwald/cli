import { useStdout } from "ink";
import { Boxes } from "cli-boxes";

interface BoxStyles {
  borderStyle: keyof Boxes;
  paddingX: number;
  paddingY: number;
  width: number | `${string}%`;
}

/**
 * Provides default box styles based on the terminal output environment. If the
 * terminal supports TTY (Text Terminal), default styles such as border style
 * and horizontal padding are applied.
 *
 * @returns The default styles for a box. Returns an object containing styles
 *   like `borderStyle` and `paddingX` when the terminal is TTY, otherwise
 *   returns an empty object.
 */
export default function useDefaultBoxStyles(): Partial<BoxStyles> {
  const { stdout } = useStdout();

  if (stdout.isTTY) {
    return {
      borderStyle: "single",
      paddingX: 2,
      width: 80,
    };
  }

  return {
    width: 99999,
  };
}
