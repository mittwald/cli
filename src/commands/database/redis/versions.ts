import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../../lib/resources/project/flags.js";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2RedisVersions.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
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
    const projectId = await this.withProjectId(Versions);
    return await this.apiClient.database.listRedisVersions({
      queryParameters: { projectId },
    });
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      id: { header: "ID" },
      name: {},
      version: { get: (item) => item.number },
    };
  }
}
