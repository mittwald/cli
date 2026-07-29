import { Response, Simplify } from "@mittwald/api-client-commons";
import { assertStatus, type MittwaldAPIV2 } from "@mittwald/api-client";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { ListColumns } from "../../../rendering/formatter/Table.js";
import { Flags } from "@oclif/core";

type Template = MittwaldAPIV2.Components.Schemas.ContainerTemplate;
type TemplateType = Template["type"];

type ListResponse = Response<Template[]>;
type ListItem = Simplify<Template>;

export class List extends ListBaseCommand<typeof List, ListItem, ListResponse> {
  static description =
    "List container templates that stacks can be created from.";
  static aliases = ["stack:templates:ls"];

  static examples = [
    {
      description: "List all templates of a given category",
      command: "<%= config.bin %> <%= command.id %> --category cms",
    },
    {
      description: "List only standalone templates",
      command: "<%= config.bin %> <%= command.id %> --type standalone",
    },
  ];

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    category: Flags.string({
      summary: "only list templates belonging to the given category",
    }),
    type: Flags.custom<TemplateType>({
      summary: "only list templates of the given type",
      options: ["component", "standalone"],
    })(),
  };

  public async getData(): Promise<ListResponse> {
    const { category, type } = this.flags;
    const response = await this.apiClient.container.listTemplates({
      queryParameters: { category, type },
    });

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
