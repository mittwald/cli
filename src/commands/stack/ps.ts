import { Response, Simplify } from "@mittwald/api-client-commons";
import { assertStatus, type MittwaldAPIV2 } from "@mittwald/api-client";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { ListColumns } from "../../rendering/formatter/Table.js";
import { stackFlags } from "../../lib/resources/stack/flags.js";
import { makeDateRendererForFormat } from "../../rendering/textformat/formatDate.js";

type ContainerServiceResponse =
  MittwaldAPIV2.Components.Schemas.ContainerServiceResponse;
type ListResponse = Response<ContainerServiceResponse[]>;
type ListItem = Simplify<ContainerServiceResponse>;

export class ListContainers extends ListBaseCommand<
  typeof ListContainers,
  ListItem,
  ListResponse
> {
  static description = "List all services within a given container stack.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...stackFlags,
  };

  public async getData(): Promise<ListItem[]> {
    const stackId = await this.withStackId(ListContainers);
    const response = await this.apiClient.container.getStack({
      stackId,
    });

    assertStatus(response, 200);
    return response.data.services || [];
  }

  protected getColumns(data: ListItem[]): ListColumns<ListItem> {
    const { id } = super.getColumns(data);
    const dateFormatter = makeDateRendererForFormat(
      this.flags.output,
      !this.flags["no-relative-dates"],
    );
    return {
      id,
      name: {
        get: (svc) => svc.serviceName,
      },
      image: {
        get: (svc) => svc.deployedState.image,
      },
      command: {
        get: (svc) => svc.deployedState.command?.join(" ") ?? "(from image)",
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
