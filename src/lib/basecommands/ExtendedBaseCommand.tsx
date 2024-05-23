import { BaseCommand } from "./BaseCommand.js";
import { CommandArgs, CommandFlags } from "./CommandFlags.js";
import { withAppInstallationId } from "../resources/app/flags.js";
import { CommandType } from "../context/FlagSetBuilder.js";
import { withProjectId } from "../resources/project/flags.js";
import { withServerId } from "../resources/server/flags.js";

export abstract class ExtendedBaseCommand<
  T extends typeof BaseCommand,
> extends BaseCommand {
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

  public async withAppInstallationId(
    command: CommandType<"installation"> | "flag" | "arg",
  ): Promise<string> {
    return withAppInstallationId(
      this.apiClient,
      command,
      this.flags,
      this.args,
      this.config,
    );
  }

  public async withProjectId(
    command: CommandType<"project"> | "flag" | "arg",
  ): Promise<string> {
    return withProjectId(
      this.apiClient,
      command,
      this.flags,
      this.args,
      this.config,
    );
  }

  public async withServerId(
    command: CommandType<"server"> | "flag" | "arg",
  ): Promise<string> {
    return withServerId(
      this.apiClient,
      command,
      this.flags,
      this.args,
      this.config,
    );
  }
}
