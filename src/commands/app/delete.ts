import { Flags, Args, ux } from "@oclif/core";
import { BaseCommand } from "../../BaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { isUuid } from "../../Helpers.js";

export default class Delete extends BaseCommand<typeof Delete> {
  static description = "Delete an app";

  static args = {
    id: Args.string({
      required: true,
      description: "ID of the app to be deleted.",
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

    if (!isUuid(id)) {
      throw new Error("AppID does not seem to be valid");
    }

    if (!(await this.confirmDeletion(flags.force))) {
      this.log("aborting.");
      return;
    }

    ux.action.start("deleting app");

    const project = await this.apiClient.app.uninstallAppinstallation({
      pathParameters: { appInstallationId: id },
    });

    assertStatus(project, 204);
    ux.action.stop(`deleted app ${id}`);
  }

  private async confirmDeletion(force: boolean): Promise<boolean> {
    if (force) {
      return true;
    }

    const promptResult = await ux.prompt(
      "Are you sure you want to delete this app? y/n",
      {
        type: "single",
      },
    );

    return promptResult === "y";
  }
}
