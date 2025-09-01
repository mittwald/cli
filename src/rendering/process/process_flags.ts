import { ProcessRenderer } from "./process.js";
import { FancyProcessRenderer } from "./process_fancy.js";
import { Flags } from "@oclif/core";
import { SilentProcessRenderer } from "./process_quiet.js";
import { InferredFlags } from "@oclif/core/interfaces";
import { SimpleProcessRenderer } from "./process_simple.js";

export const processFlags = {
  quiet: Flags.boolean({
    char: "q",
    summary:
      "suppress process output and only display a machine-readable summary",
    description:
      "This flag controls if you want to see the process output or only a summary. When using <%= config.bin %> non-interactively (e.g. in scripts), you can use this flag to easily get the IDs of created resources for further processing.",
  }),
};

export type ProcessFlags = InferredFlags<typeof processFlags>;

/**
 * Create a ProcessRenderer based on the given flags. Currently, only two
 * renderers are available:
 *
 * - `FancyProcessRenderer` for interactive output
 * - `SilentProcessRenderer` for non-interactive output when the `quiet` flag is
 *   set
 *
 * More renderers may be added in the future.
 *
 * @param flags
 * @param title
 */
export const makeProcessRenderer = (
  flags: ProcessFlags,
  title: string,
): ProcessRenderer => {
  if (flags.quiet) {
    return new SilentProcessRenderer();
  }

  if (!process.stdout.isTTY) {
    return new SimpleProcessRenderer(title);
  }

  return new FancyProcessRenderer(title);
};
