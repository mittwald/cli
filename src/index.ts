/**
 * Public API of the mittwald CLI for plugins: base commands and common types.
 *
 * Plugins import everything they need from "@mittwald/cli" and its subpaths
 * ("@mittwald/cli/flags", "@mittwald/cli/rendering" and
 * "@mittwald/cli/resources", see src/api/); the "exports" field of the
 * package.json prevents imports of any other module of this package. Everything
 * exported there is covered by semantic versioning, so removing or incompatibly
 * changing an export is a breaking change of the CLI.
 */

export { CoreBaseCommand } from "./lib/basecommands/CoreBaseCommand.js";
export { BaseCommand } from "./lib/basecommands/BaseCommand.js";
export { UnauthenticatedBaseCommand } from "./lib/basecommands/UnauthenticatedBaseCommand.js";
export { ExtendedBaseCommand } from "./lib/basecommands/ExtendedBaseCommand.js";
export { ExecRenderBaseCommand } from "./lib/basecommands/ExecRenderBaseCommand.js";
export { RenderBaseCommand } from "./lib/basecommands/RenderBaseCommand.js";
export { GetBaseCommand } from "./lib/basecommands/GetBaseCommand.js";
export {
  ListBaseCommand,
  type ColumnOpts,
  type SorterFunction,
} from "./lib/basecommands/ListBaseCommand.js";
export { DeleteBaseCommand } from "./lib/basecommands/DeleteBaseCommand.js";
export type {
  CommandArgs,
  CommandFlags,
} from "./lib/basecommands/CommandFlags.js";

// Also needed to name the types of flags like --wait-timeout.
export { default as Duration } from "./lib/units/Duration.js";

export { default as handleError } from "./lib/error/handleError.js";
