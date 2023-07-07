import { Flags, Args, ux } from "@oclif/core";
import { BaseCommand } from "../../../BaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";

export default class Delete extends BaseCommand<typeof Delete> {
  static description = "Delete an SSH key";

  static args = {
    id: Args.string({
      required: true,
      description: "ID of the SSH key to be deleted.",
    }),
  };

  static flags = {
    force: Flags.boolean({
      char: "f",
      description: "delete without prompting for confirmation",
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Delete);
    const { id } = args;

    if (!(await this.confirmDeletion(flags.force))) {
      this.log("aborting.");
      return;
    }

    ux.action.start("deleting SSH key");

    const response = await this.apiClient.user.deleteSshKey({
      pathParameters: { sshKeyId: id },
    });

    assertStatus(response, 200);
    ux.action.stop("deleted");
  }

  private async confirmDeletion(force: boolean): Promise<boolean> {
    if (force) {
      return true;
    }

    const promptResult = await ux.prompt(
      "Are you sure you want to delete this SSH key? y/n",
      {
        type: "single",
      },
    );

    return promptResult === "y";
  }
}
