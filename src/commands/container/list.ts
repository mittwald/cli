import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { ListColumns } from "../../rendering/formatter/Table.js";
import { makeDateRendererForFormat } from "../../rendering/textformat/formatDate.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdServices.Get.Responses.$200.Content.ApplicationJson[number]
>;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["container"]["listServices"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List containers belonging to a project.";

  static aliases = ["container:ls"];
  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return this.apiClient.container.listServices({ projectId });
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const { id, shortId } = super.getColumns(data);
    const dateFormatter = makeDateRendererForFormat(
      this.flags.output,
      !this.flags["no-relative-dates"],
    );
    return {
      id,
      stackId: {
        header: "Stack ID",
        extended: true,
        exactWidth: 40,
      },
      shortId,
      name: {
        get: (svc) => svc.serviceName,
      },
      image: {
        get: (svc) => svc.deployedState.image,
      },
      command: {
        get: (svc) => svc.deployedState.command?.join(" "),
      },
      description: {},
      ports: {
        get: (svc) => {
          if (
            svc.deployedState.ports === undefined ||
            svc.deployedState.ports.length === 0
          ) {
            return "no ports";
          }
          return svc.deployedState.ports.join(", ");
        },
      },
      status: {
        get(svc) {
          return svc.status + " (" + dateFormatter(svc.statusSetAt) + ")";
        },
      },
    };
  }
}
