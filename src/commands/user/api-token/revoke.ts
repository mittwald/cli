import { Args, ux } from "@oclif/core";
import { BaseCommand } from "../../../BaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";

export default class Revoke extends BaseCommand<typeof Revoke> {
  static description = "Revoke an API token";

  static args = {
    id: Args.string({
      description: "ID of the API token to revoke",
      required: true,
    }),
  };

  async run() {
    const { args } = await this.parse(Revoke);

    ux.action.start(`revoking API token ${args.id}`);

    const response = await this.apiClient.user.deleteApiToken({
      pathParameters: { apiTokenId: args.id },
    });

    assertStatus(response, 200);
    ux.action.stop();
  }
}
