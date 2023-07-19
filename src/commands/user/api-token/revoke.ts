import { Args } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { DeleteBaseCommand } from "../../../DeleteBaseCommand.js";

export default class Revoke extends DeleteBaseCommand<typeof Revoke> {
  static description = "Revoke an API token";
  static resource = "API token";

  static args = {
    id: Args.string({
      description: "ID of the API token to revoke",
      required: true,
    }),
  };
  static flags = { ...DeleteBaseCommand.baseFlags };

  protected async deleteResource(): Promise<void> {
    const { args } = await this.parse(Revoke);
    const response = await this.apiClient.user.deleteApiToken({
      pathParameters: { apiTokenId: args.id },
    });

    assertStatus(response, 204);
  }
}
