import { Args, Flags, ux } from "@oclif/core";
import { BaseCommand } from "../../../BaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import parseDuration from "parse-duration";
import { MittwaldAPIV2 } from "@mittwald/api-client";

type Roles =
  MittwaldAPIV2.Paths.V2SignupTokenApi.Post.Parameters.RequestBody["roles"];

export default class Create extends BaseCommand<typeof Create> {
  static description = "Create a new API token";

  static flags = {
    description: Flags.string({
      description: "Description of the API token",
      required: true,
    }),
    "expires-in": Flags.string({
      description: "Expiration interval of the API token (example: 30d)",
    }),
    roles: Flags.string({
      description: "Roles of the API token",
      required: true,
      multiple: true,
      options: ["api_read", "api_write"],
    }),
  };

  private determineExpiration(input: string | undefined): Date | undefined {
    if (input === undefined) {
      return undefined;
    }

    const duration = parseDuration(input);
    if (duration === undefined) {
      throw new Error(`Could not parse duration ${input}`);
    }

    return new Date(Date.now() + duration);
  }

  async run() {
    const { flags, args } = await this.parse(Create);
    const expiresAt = this.determineExpiration(flags["expires-in"]);

    ux.action.start("creating API token");

    const response = await this.apiClient.user.createApiToken({
      data: {
        description: flags.description,
        expiresAt: expiresAt?.toJSON(),
        roles: flags.roles as Roles,
      },
    });

    assertStatus(response, 201);
    ux.action.stop();
  }
}
