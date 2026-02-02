import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { ListColumns } from "../../rendering/formatter/Table.js";
import { formatRelativeDate } from "../../rendering/textformat/formatDate.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdCronjobs.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
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

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const { id, shortId, createdAt } = super.getColumns(data);
    return {
      id,
      shortId,
      interval: {},
      description: {},
      timezone: {
        header: "Timezone",
        get: (r) => r.timeZone || "UTC",
      },
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
