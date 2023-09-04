import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { ListColumns } from "../../../Formatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";
import CustomerCustomer = MittwaldAPIV2.Components.Schemas.CustomerCustomer;

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2CustomerMemberships.Get.Responses.$200.Content.ApplicationJson[number]
> & {
  org?: CustomerCustomer;
};

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomerMemberships.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["listCustomerMemberships"]>
>;

export class ListOwn extends ListBaseCommand<
  typeof ListOwn,
  ResponseItem,
  Response
> {
  static description =
    "List all organization memberships for the executing user.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.customer.listCustomerMemberships(
      (await this.mapParams(pathParams)) as Parameters<
        typeof this.apiClient.customer.listCustomerMemberships
      >[0],
    );
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return Promise.all(
      data.map(async (item) => {
        const { customerId } = item;
        const org = await this.apiClient.customer.getCustomer({
          customerId,
        });

        if (org.status === 200) {
          return { ...item, org: org.data };
        }
        return item;
      }),
    );
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      role: {},
      org: {
        get: (item) => item.org?.name ?? "(unknown org)",
      },
      memberSince: {
        header: "Member since",
        get: (item) => formatRelativeDate(item.memberSince),
      },
    };
  }
}
