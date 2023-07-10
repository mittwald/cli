import { Args } from "@oclif/core";
import { BaseCommand } from "../../BaseCommand.js";
import { projectArgs, withProjectId } from "../../lib/project/flags.js";

export default class Update extends BaseCommand<typeof Update> {
  static description = "Updates a project";
  static args = { ...projectArgs };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Update);
    const id = await withProjectId(this.apiClient, {}, args, this.config);

    console.log("updating project ", id);
    console.log("TODO: Implement me");
  }
}
