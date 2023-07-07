import { Args } from "@oclif/core";
import { BaseCommand } from "../../BaseCommand.js";

export default class Update extends BaseCommand<typeof Update> {
  static description = "Updates a project";

  static args = {
    id: Args.string({
      required: true,
      description: "ID of the Project to be retrieved.",
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Update);

    console.log(args, flags);
  }
}
