/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../types.js";
import {
  GeneratedCustomerListCustomers,
  Response,
} from "../../generated/customer/listCustomers.js";
import { ListColumns } from "../../Formatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Customers.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedCustomerListCustomers<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    return {
      id: {
        get: (r) => r.customerId,
        minWidth: 36,
      },
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
        }
      },
      memberCount: { header: "Members" },
      projectCount: { header: "Projects"},
    };
  }
}
