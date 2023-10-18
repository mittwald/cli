import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListColumns } from "../../../Formatter.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { Flags } from "@oclif/core";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2CronjobsCronjobIdExecutions.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["cronjob"]["listExecutions"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List CronjobExecutions belonging to a Cronjob.";

  static aliases = ["project:cronjob:execution:list"];
  static deprecateAliases = true;
  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "cronjob-id": Flags.string({
      description: "ID of the Cronjob for which to list CronjobExecutions for.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams = {
      cronjobId: this.flags["cronjob-id"],
    };

    return await this.apiClient.cronjob.listExecutions(
      pathParams as Parameters<typeof this.apiClient.cronjob.listExecutions>[0],
    );
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      id: {},
      status: {},
      duration: {
        get: (r) =>
          r.durationInMilliseconds
            ? Math.round(r.durationInMilliseconds / 1000) + "s"
            : "",
      },
      started: {
        get: (r) => formatRelativeDate(r.executionStart),
      },
      ended: {
        get: (r) => formatRelativeDate(r.executionEnd),
      },
    };
  }
}
