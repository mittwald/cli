import { ProcessRenderer } from "./process.js";
import { FancyProcessRenderer } from "./process_fancy.js";
import { Flags } from "@oclif/core";
import { SilentProcessRenderer } from "./process_quiet.js";
import { InferredFlags } from "@oclif/core/lib/interfaces/index.js";

export const processFlags = {
  quiet: Flags.boolean({
    char: "q",
    description:
      "Suppress process output and only display a machine-readable summary.",
  }),
};

export type ProcessFlags = InferredFlags<typeof processFlags>;

export const makeProcessRenderer = (
  flags: { quiet: boolean },
  title: string,
): ProcessRenderer => {
  if (flags.quiet) {
    return new SilentProcessRenderer();
  }
  return new FancyProcessRenderer(title);
};
