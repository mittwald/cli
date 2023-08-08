import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";
import { ListColumns } from "../../../Formatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2RedisVersions.Get.Responses.$200.Content.ApplicationJson[number]
>;
export type PathParams =
  MittwaldAPIV2.Paths.V2RedisVersions.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["listRedisVersions"]>
>;

export default class Versions extends ListBaseCommand<
  typeof Versions,
  ResponseItem,
  Response
> {
  static description = "List available Redis versions.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await withProjectId(
      this.apiClient,
      Versions,
      this.flags,
      this.args,
      this.config,
    );
    return await this.apiClient.database.listRedisVersions({
      pathParameters: {},
      queryParameters: { projectId },
    } as Parameters<typeof this.apiClient.database.listRedisVersions>[0]);
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      id: { header: "ID" },
      name: {},
      version: { get: (item) => item.number },
    };
  }
}
