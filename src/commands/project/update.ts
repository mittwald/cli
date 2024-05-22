import { projectArgs } from "../../lib/project/flags.js";
import { ExtendedBaseCommand } from "../../lib/basecommands/ExtendedBaseCommand.js";

export default class Update extends ExtendedBaseCommand<typeof Update> {
  static description = "Updates a project";
  static args = { ...projectArgs };

  public async run(): Promise<void> {
    const id = await this.withProjectId(Update);

    console.log("updating project ", id);
    console.log("TODO: Implement me");
  }
}
