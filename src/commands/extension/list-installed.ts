import { assertStatus, Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { ListColumns } from "../../rendering/formatter/Table.js";
import { SuccessfulResponse } from "../../lib/apiutil/SuccessfulResponse.js";
import { Flags } from "@oclif/core";
import Context, { contextIDNormalizers } from "../../lib/context/Context.js";

type Extension = MittwaldAPIV2.Components.Schemas.MarketplaceExtension;

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ExtensionInstances.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<
    MittwaldAPIV2Client["marketplace"]["extensionListExtensionInstances"]
  >
>;

type ExtendedResponseItem = ResponseItem & {
  extension: Extension;
};

export class ListInstalled extends ListBaseCommand<
  typeof ListInstalled,
  ResponseItem,
  Response
> {
  static description =
    "List installed extensions in an organization or project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "org-id": Flags.string({
      description: "the ID of the organization to install the extension in",
      exactlyOne: ["org-id", "project-id"],
    }),
    "project-id": Flags.string({
      description: "the ID of the project to install the extension in",
      exactlyOne: ["org-id", "project-id"],
    }),
  };

  public async getData(): Promise<Response> {
    let { "org-id": orgId, "project-id": projectId } = this.flags;

    const ctx = new Context(this.apiClient, this.config);

    if (orgId) {
      const normalizer = contextIDNormalizers["org-id"]!;
      orgId = await normalizer(this.apiClient, orgId, ctx);
    }

    if (projectId) {
      const normalizer = contextIDNormalizers["project-id"]!;
      projectId = await normalizer(this.apiClient, projectId, ctx);
    }

    return await this.apiClient.marketplace.extensionListExtensionInstances({
      queryParameters: {
        context: orgId ? "customer" : "project",
        contextId: (orgId ?? projectId)!,
      },
    });
  }

  protected mapData(
    data: SuccessfulResponse<Response, 200>["data"],
  ): Promise<ExtendedResponseItem[]> {
    return Promise.all(
      data.map(async (item) => {
        const resp = await this.apiClient.marketplace.extensionGetExtension({
          extensionId: item.extensionId,
        });

        assertStatus(resp, 200);
        const extension = resp.data as Extension;

        return {
          ...item,
          extension,
        };
      }),
    );
  }

  protected getColumns(data: ExtendedResponseItem[]) {
    return this.getColumnsExtended(data) as ListColumns<ResponseItem>;
  }

  protected getColumnsExtended(
    data: ExtendedResponseItem[],
  ): ListColumns<ExtendedResponseItem> {
    const { id } = super.getColumns(data, {});
    return {
      id,
      extension: {
        header: "Extension",
        get: (row) => row.extension.name,
      },
      state: {
        header: "State",
        get: (row) => {
          // Temporary "as any" cast, because the API response is not typed correctly
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((row as any).pendingInstallation) {
            return "installing";
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((row as any).pendingRemoval) {
            return "removing";
          }
          if (row.disabled) {
            return "disabled";
          }
          return "enabled";
        },
      },
    };
  }
}
