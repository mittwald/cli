import { ux } from "@oclif/core";
import { BaseCommand } from "../../lib/basecommands/BaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { formatDistanceToNow } from "date-fns";

export default class Status extends BaseCommand {
  static description = "Checks your current authentication status";

  public async run(): Promise<void> {
    const response = await this.apiClient.user.getOwnAccount();
    assertStatus(response, 200);

    const output: Record<string, unknown> = {
      "User identification": {
        ID: response.data.userId,
        Email: response.data.email,
      },
    };

    if (response.data.person) {
      output["Name"] =
        `${response.data.person.firstName} ${response.data.person.lastName}`;
    }

    if (response.data.passwordUpdatedAt) {
      output["Last password change"] = `${formatDistanceToNow(
        new Date(response.data.passwordUpdatedAt),
      )} ago`;
    }

    ux.styledObject(output, [
      "User identification",
      "Name",
      "Last password change",
    ]);

    // console.log(response);
  }
}
