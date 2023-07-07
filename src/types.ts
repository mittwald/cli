import { Response } from "@mittwald/api-client-commons";
import { BaseCommand } from "./BaseCommand.js";
import { Interfaces } from "@oclif/core";

export type SuccessfulResponse<
  T extends Response,
  S extends T["status"],
> = T & {
  status: S;
};

export type CommandFlags<T extends typeof BaseCommand> =
  Interfaces.InferredFlags<T["flags"]>;

export type CommandArgs<T extends typeof BaseCommand> = Interfaces.InferredArgs<
  T["args"]
>;
