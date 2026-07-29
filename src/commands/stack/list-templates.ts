import { Response, Simplify } from "@mittwald/api-client-commons";
import { assertStatus, type MittwaldAPIV2 } from "@mittwald/api-client";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { ListColumns } from "../../rendering/formatter/Table.js";

type Template = MittwaldAPIV2.Components.Schemas.ContainerTemplate;

type ListResponse = Response<Template[]>;
type ListItem = Simplify<Template>;

export class ListTemplates extends ListBaseCommand<
  typeof ListTemplates,
  ListItem,
  ListResponse
> {
  static description =
    "List container templates that stacks can be created from.";
  static aliases = ["stack:templates"];

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<ListResponse> {
    const response = await this.apiClient.container.listTemplates();

    assertStatus(response, 200);
    return response;
  }

  protected getColumns(): ListColumns<ListItem> {
    return {
      id: {
        header: "ID",
      },
      name: {
        get(template) {
          return template.name.en;
        },
      },
      type: {},
      version: {},
      developer: {},
      categories: {
        get(template) {
          return template.categories.join(", ");
        },
      },
    };
  }
}
