import { Command, Interfaces } from "@oclif/core";
import { BaseCommand } from "./BaseCommand.js";
import { GetFormatter } from "../../rendering/Formatter.js";
import { assertStatus, Response } from "@mittwald/api-client-commons";
import { ExtendedBaseCommand } from "./ExtendedBaseCommand.js";

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
  (typeof GetBaseCommand)["baseFlags"] & T["flags"]
>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T["args"]>;

export abstract class GetBaseCommand<
  T extends typeof BaseCommand,
  TAPIResponse extends Response,
> extends ExtendedBaseCommand<T> {
  static baseFlags = {
    ...GetFormatter.flags,
  };

  protected formatter: GetFormatter = new GetFormatter();

  public async init(): Promise<void> {
    await super.init();

    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });
    this.args = args as Args<T>;
    this.flags = flags as Flags<T>;
  }

  public async run(): Promise<void> {
    const response = await this.getData();

    assertStatus(response, 200);

    this.formatter.log(response.data, { outputFormat: this.flags.output });
  }

  protected abstract getData(): Promise<TAPIResponse>;
}
