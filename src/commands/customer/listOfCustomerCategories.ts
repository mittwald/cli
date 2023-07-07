/* eslint-disable */
/* prettier-ignore */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../types.js";
import {
  GeneratedCustomerListOfCustomerCategories,
  Response,
} from "../../generated/customer/listOfCustomerCategories.js";

type ResponseItem = Simplify<
  Required<MittwaldAPIV2.Paths.V2CustomerCategories.Get.Responses.$200.Content.ApplicationJson>["categories"][number]
>;
export default class List extends GeneratedCustomerListOfCustomerCategories<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data.categories ?? [];
  }
}
