import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListColumns } from "../../rendering/formatter/ListFormatter.js";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Customers.Get.Responses.$200.Content.ApplicationJson[number]
>;
export type PathParams = MittwaldAPIV2.Paths.V2Customers.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["listCustomers"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description =
    "Get all organizations the authenticated user has access to.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.customer.listCustomers(
      (await this.mapParams(pathParams)) as Parameters<
        typeof this.apiClient.customer.listCustomers
      >[0],
    );
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const { id, customerNumber } = super.getColumns(data, {
      shortIdKey: "customerNumber",
    });
    return {
      id: {
        ...id,
        get: (r) => r.customerId,
      },
      customerNumber,
      name: {},
      owner: {
        get: (r) => {
          if (!r.owner) {
            return "not set";
          }

          if (r.owner.company) {
            return `${r.owner.firstName} ${r.owner.lastName}, ${r.owner.company}`;
          }

          return `${r.owner.firstName} ${r.owner.lastName}`;
        },
      },
      memberCount: { header: "Members" },
      projectCount: { header: "Projects" },
    };
  }
}
