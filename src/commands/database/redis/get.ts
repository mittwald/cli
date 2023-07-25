import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2RedisDatabasesId.Get.Parameters.Path;
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
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.database.getRedisDatabase>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
