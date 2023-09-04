/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2UsersUserIdFeedback.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["listFeedback"]>
>;

export abstract class GeneratedUserListFeedback<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<typeof GeneratedUserListFeedback, TItem, Response> {
  static description = "Submitted feedback of the given user.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "user-id": Flags.string({
      description: "`self` or the id of a user.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      userId: this.flags["user-id"],
    };
    return await this.apiClient.user.listFeedback(
      (await this.mapParams(pathParams)) as Parameters<
        typeof this.apiClient.user.listFeedback
      >[0],
    );
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
