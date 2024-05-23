import { Context } from "../../lib/context/context.js";
import { BaseCommand } from "../../lib/basecommands/BaseCommand.js";

export class Reset extends BaseCommand {
  static summary = "Reset context values";
  static description =
    "This command resets any values for common parameters that you've previously set with 'context set'.";

  public async run(): Promise<void> {
    await new Context(this.apiClient, this.config).reset();
  }
}
