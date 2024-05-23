import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../lib/apiutil/SuccessfulResponse.js";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { ListColumns } from "../../Formatter.js";
import { formatRelativeDate } from "../../lib/viewhelpers/date.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdCronjobs.Get.Responses.$200.Content.ApplicationJson[number]
>;
export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdCronjobs.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["cronjob"]["listCronjobs"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List cron jobs belonging to a project.";

  static aliases = ["project:cronjob:list"];
  static deprecateAliases = true;
  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return await this.apiClient.cronjob.listCronjobs({ projectId });
  }

  protected mapData(
    data: SuccessfulResponse<Response, 200>["data"],
  ): ResponseItem[] | Promise<ResponseItem[]> {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const { id, shortId, createdAt } = super.getColumns(data);
    return {
      id,
      shortId,
      interval: {},
      description: {},
      lastExecution: {
        header: "Last execution",
        get: (r) => {
          if (!r.latestExecution) {
            return "-";
          }
          return (
            r.latestExecution.status +
            ", " +
            // API specs are broken
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatRelativeDate((r.latestExecution as any).start)
          );
        },
      },
      createdAt,
    };
  }
}
