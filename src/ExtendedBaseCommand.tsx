import { BaseCommand } from "./BaseCommand.js";
import { CommandArgs, CommandFlags } from "./types.js";

export abstract class ExtendedBaseCommand<
  T extends typeof BaseCommand,
> extends BaseCommand<T> {
  protected flags!: CommandFlags<T>;
  protected args!: CommandArgs<T>;

  public async init(): Promise<void> {
    await super.init();

    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof ExtendedBaseCommand).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });
    this.args = args as CommandArgs<T>;
    this.flags = flags as CommandFlags<T>;
  }
}
