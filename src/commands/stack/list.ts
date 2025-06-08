import { Response, Simplify } from "@mittwald/api-client-commons";
import { assertStatus, type MittwaldAPIV2 } from "@mittwald/api-client";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { ListColumns } from "../../rendering/formatter/Table.js";

type Stack = MittwaldAPIV2.Components.Schemas.ContainerStackResponse;

type ListResponse = Response<Stack[]>;
type ListItem = Simplify<Stack>;

export class List extends ListBaseCommand<typeof List, ListItem, ListResponse> {
  static description = "List container stacks for a given project.";
  static aliases = ["stack:ls"];

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<ListResponse> {
    const projectId = await this.withProjectId(List);
    const response = await this.apiClient.container.listStacks({
      projectId,
    });

    assertStatus(response, 200);
    return response;
  }

  protected getColumns(data: ListItem[]): ListColumns<ListItem> {
    const { id } = super.getColumns(data);
    return {
      id,
      description: {},
      services: {
        get(stack) {
          if (stack.services === undefined || stack.services.length === 0) {
            return "no services";
          }

          const countByStatus: Record<string, number> = {};
          let requireRecreate = 0;
          for (const service of stack.services || []) {
            countByStatus[service.status] =
              (countByStatus[service.status] || 0) + 1;
            if (service.requiresRecreate) {
              requireRecreate++;
            }
          }

          const summaryItems = [];
          for (const status of Object.keys(countByStatus)) {
            summaryItems.push(countByStatus[status] + " " + status);
          }

          let summary = summaryItems.join(", ");
          if (requireRecreate > 0) {
            summary += ` (${requireRecreate} require recreation)`;
          }

          return summary;
        },
      },
      volumes: {
        get(stack) {
          if (stack.volumes === undefined || stack.volumes.length === 0) {
            return "no volumes";
          }

          return stack.volumes.length + " volumes";
        },
      },
    };
  }
}
