import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2RedisDatabasesRedisDatabaseId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["getRedisDatabase"]>
>;

export class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a Redis database.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    id: Args.string({
      description: "ID of the Redis database to retrieve.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.database.getRedisDatabase({
      redisDatabaseId: this.args.id,
    });
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
