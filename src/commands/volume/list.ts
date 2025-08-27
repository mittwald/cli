import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { ListColumns } from "../../rendering/formatter/Table.js";
import { makeDateRendererForFormat } from "../../rendering/textformat/formatDate.js";
import ByteQuantity from "../../lib/units/ByteQuantity.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdVolumes.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["container"]["listVolumes"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List volumes belonging to a project.";

  static aliases = ["volume:ls"];
  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return this.apiClient.container.listVolumes({ projectId });
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const { id } = super.getColumns(data);
    const dateFormatter = makeDateRendererForFormat(
      this.flags.output,
      !this.flags["no-relative-dates"],
    );
    return {
      id: {
        ...id,
        extended: true,
      },
      name: {
        get: (volume) => volume.name,
      },
      stackId: {
        header: "Stack",
        extended: true,
        exactWidth: 40,
      },
      usedIn: {
        header: "Used in",
        get: (volume) => {
          if (volume.orphaned) {
            return "orphaned";
          }

          return (volume.linkedServices ?? []).length + " services";
        },
      },
      storageUsage: {
        header: "Size",
        get: (volume) =>
          ByteQuantity.fromBytes(volume.storageUsageInBytes).format() +
          " (updated " +
          dateFormatter(volume.storageUsageInBytesSetAt) +
          ")",
      },
    };
  }
}
