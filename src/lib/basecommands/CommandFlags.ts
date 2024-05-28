import { BaseCommand } from "./BaseCommand.js";
import { Interfaces } from "@oclif/core";

/** CommandFlags is a helper type that extracts the flags from a command class. */
export type CommandFlags<T extends typeof BaseCommand> =
  Interfaces.InferredFlags<T["flags"]>;

/** CommandArgs is a helper type that extracts the args from a command class. */
export type CommandArgs<T extends typeof BaseCommand> = Interfaces.InferredArgs<
  T["args"]
>;
