import { ContextNames } from "./Context.js";
import { ArgOutput, FlagOutput } from "@oclif/core/lib/interfaces/parser.js";
import { Config } from "@oclif/core";
import { CommandType, ContextArgs, ContextFlags } from "./FlagSetBuilder.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";

/**
 * FlagSet defines a standardized set of flags and arguments for a specific
 * context. It is used to define a reusable set of flags and arguments that can
 * be used in multiple commands.
 *
 * Typically, a FlagSet is created using the `makeFlagSet` function (or a
 * derivative of it).
 */
export default interface FlagSet<TName extends ContextNames> {
  name: TName;
  flags: ContextFlags<TName>;
  args: ContextArgs<TName>;
  withId: (
    apiClient: MittwaldAPIV2Client,
    command: CommandType<TName> | "flag" | "arg",
    flags: FlagOutput,
    args: ArgOutput,
    cfg: Config,
  ) => Promise<string>;
}
