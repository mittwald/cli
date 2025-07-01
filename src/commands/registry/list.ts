import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { ListColumns } from "../../rendering/formatter/Table.js";

type ContainerRegistry = MittwaldAPIV2.Components.Schemas.ContainerRegistry;

type ResponseItem = Simplify<ContainerRegistry>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["container"]["listRegistries"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List container registries.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return this.apiClient.container.listRegistries({ projectId });
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const { id } = super.getColumns(data);
    return {
      id,
      description: {},
      uri: {
        header: "URI",
      },
      credentials: {
        header: "Credentials",
        get: (registry) => {
          if (!registry.credentials) {
            return "";
          }
          return `${registry.credentials.username} (${registry.credentials.valid ? "valid" : "invalid"})`;
        },
      },
    };
  }
}
