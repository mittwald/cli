/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import {
  GeneratedCustomerListMembershipsForCustomer,
  Response,
} from "../../../generated/customer/listMembershipsForCustomer.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2CustomersCustomerIdMemberships.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedCustomerListMembershipsForCustomer<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }
}
