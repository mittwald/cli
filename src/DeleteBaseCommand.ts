import { Command, Flags, Interfaces, ux } from "@oclif/core";
import { BaseCommand } from "./BaseCommand.js";

export type DeleteFlags<T extends typeof Command> = Interfaces.InferredFlags<
  (typeof DeleteBaseCommand)["baseFlags"] & T["flags"]
>;
export type DeleteArgs<T extends typeof Command> = Interfaces.InferredArgs<
  T["args"]
>;

export abstract class DeleteBaseCommand<
  T extends typeof Command,
> extends BaseCommand<T> {
  static resourceName = "object";
  static baseFlags = {
    force: Flags.boolean({
      description: "Do not ask for confirmation",
    }),
  };

  protected flags!: DeleteFlags<T>;
  protected args!: DeleteArgs<T>;

  public async init(): Promise<void> {
    await super.init();
    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });

    this.args = args as DeleteArgs<T>;
    this.flags = flags as DeleteFlags<T>;
  }

  public async run(): Promise<void> {
    const resourceName = (this.ctor as typeof DeleteBaseCommand).resourceName;

    if (!this.flags.force) {
      const confirmed = await ux.confirm(
        `Do you really want to delete this ${resourceName}?`,
      );
      if (!confirmed) {
        this.log("aborting");
        ux.exit(1);
        return;
      }
    }

    ux.action.start(`deleting ${resourceName}`);

    await this.deleteResource();

    ux.action.stop();
  }

  protected abstract deleteResource(): Promise<void>;
}
