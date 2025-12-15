import { assertStatus, Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import {
  ListBaseCommand,
  SorterFunction,
} from "../../../lib/basecommands/ListBaseCommand.js";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";
import { Args } from "@oclif/core";
import { compareVersionsBy } from "../../../lib/resources/app/versions.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2SystemSoftwaresSystemSoftwareIdVersions.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["listSystemsoftwareversions"]>
>;

export class Versions extends ListBaseCommand<
  typeof Versions,
  ResponseItem,
  Response
> {
  static description = "Get all available versions of a particular dependency";

  static args = {
    systemsoftware: Args.string({
      description: "name of the systemsoftware for which to list versions",
      required: true,
    }),
  };
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  sorter: SorterFunction<ResponseItem> = compareVersionsBy("internal");

  public async getData(): Promise<Response> {
    const systemSoftwareName = this.args["systemsoftware"];

    const systemSoftwares = await this.apiClient.app.listSystemsoftwares({});
    assertStatus(systemSoftwares, 200);

    const systemSoftware = systemSoftwares.data.find(
      (s) => s.name.toLowerCase() === systemSoftwareName.toLowerCase(),
    );

    if (!systemSoftware) {
      throw new Error(`system software ${systemSoftwareName} not found`);
    }

    return this.apiClient.app.listSystemsoftwareversions({
      systemSoftwareId: systemSoftware.id,
    });
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      externalVersion: { header: "Version" },
    };
  }
}
