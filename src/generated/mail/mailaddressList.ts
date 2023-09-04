/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdMailaddresses.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["mail"]["mailaddressList"]>
>;

export abstract class GeneratedMailMailaddressList<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedMailMailaddressList,
  TItem,
  Response
> {
  static description = "Get all mail addresses for a project ID";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "Project ID the mailAddresses are related to",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      projectId: this.flags["project-id"],
    };
    return await this.apiClient.mail.mailaddressList(
      (await this.mapParams(pathParams)) as Parameters<
        typeof this.apiClient.mail.mailaddressList
      >[0],
    );
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
