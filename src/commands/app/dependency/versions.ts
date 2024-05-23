import { assertStatus, Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { SuccessfulResponse } from "../../../lib/apiutil/SuccessfulResponse.js";
import { ListColumns } from "../../../Formatter.js";
import { SemVer } from "semver";
import { Args } from "@oclif/core";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2SystemSoftwareSystemSoftwareIdVersions.Get.Responses.$200.Content.ApplicationJson[number]
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

    return await this.apiClient.app.listSystemsoftwareversions({
      systemSoftwareId: systemSoftware.id,
    } as Parameters<typeof this.apiClient.app.listSystemsoftwareversions>[0]);
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    data.sort((a, b) =>
      new SemVer(a.externalVersion).compare(b.externalVersion),
    );
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      externalVersion: { header: "Version" },
    };
  }
}
