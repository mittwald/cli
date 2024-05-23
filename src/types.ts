import { BaseCommand } from "./lib/basecommands/BaseCommand.js";
import { Interfaces } from "@oclif/core";

export type CommandFlags<T extends typeof BaseCommand> =
  Interfaces.InferredFlags<T["flags"]>;

export type CommandArgs<T extends typeof BaseCommand> = Interfaces.InferredArgs<
  T["args"]
>;
