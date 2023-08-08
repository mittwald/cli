import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListColumns } from "../../../Formatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdCronjobs.Get.Responses.$200.Content.ApplicationJson[number]
>;
export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdCronjobs.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["cronjob"]["listCronjobs"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List Cronjobs belonging to a Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      projectId: await withProjectId(
        this.apiClient,
        List,
        this.flags,
        this.args,
        this.config,
      ),
    };
    return await this.apiClient.cronjob.listCronjobs({
      pathParameters: pathParams,
    } as Parameters<typeof this.apiClient.cronjob.listCronjobs>[0]);
  }

  protected mapData(
    data: SuccessfulResponse<Response, 200>["data"],
  ): ResponseItem[] | Promise<ResponseItem[]> {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      shortId: baseColumns.shortId,
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
      createdAt: baseColumns.createdAt,
    };
  }
}
