import { Context } from "../../lib/context.js";
import { BaseCommand } from "../../BaseCommand.js";

export class Reset extends BaseCommand {
  static summary = "Reset context values";
  static description =
    "The context allows you reset any persistent values for common parameters that you've previously set with 'context set'.";

  public async run(): Promise<void> {
    await new Context(this.config).reset();
  }
}
