import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2RedisVersions.Get.Responses.$200.Content.ApplicationJson[number]
>;
export type PathParams =
  MittwaldAPIV2.Paths.V2RedisVersions.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["listRedisVersions"]>
>;

export default class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "List available Redis versions.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.database.listRedisVersions({
      pathParameters: {},
    } as Parameters<typeof this.apiClient.database.listRedisVersions>[0]);
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }
}
