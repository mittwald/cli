import { ExecRenderBaseCommand } from "../../../../lib/basecommands/ExecRenderBaseCommand.js";
import { Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../../rendering/process/process_flags.js";
import { Success } from "../../../../rendering/react/components/Success.js";
import assertSuccess from "../../../../lib/apiutil/assert_success.js";
type UpdateResult = void;

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description = "Create a new mysql user";
  static flags = {
    ...processFlags,
    accessLevel: Flags.string({
      required: true,
      description: "Access level for this mysql user",
      options: ["readonly", "full"],
    }),
    description: Flags.string({
      required: true,
      description: "Description of the mysql user",
    }),
    password: Flags.string({
      required: true,
      description: "Password used for authentication",
      exactlyOne: ["public-key", "password"],
    }),
    accessIpMask: Flags.string({
      description: "IP from wich external access will be exclusively allowed",
    }),
    externalAccess: Flags.boolean({
      description: "Enable/Disable external access for this user.",
    }),
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(
      this.flags,
      "Creating a new mysql User",
    );
    const mysqlUserId = await withMySQLUserId(
      this.apiClient,
      this.flags,
      this.args,
    );
    const { accessLevel, description, password, accessIpMask, externalAccess } =
      this.flags;

    const updateMysqlUserPayload: {
      accessLevel?: "full" | "readonly";
      description?: string;
      accessIpMask?: string | undefined;
      externalAccess?: boolean | undefined;
    } = {};

    if (accessLevel == "readonly" || accessLevel == "full") {
      updateMysqlUserPayload.accessLevel = accessLevel;
    } else {
      updateMysqlUserPayload.accessLevel = undefined;
    }

    if (description) {
      updateMysqlUserPayload.description = description;
    }

    if (accessIpMask) {
      updateMysqlUserPayload.accessIpMask = accessIpMask;
    }

    if (externalAccess) {
      updateMysqlUserPayload.externalAccess = true;
    } else if (externalAccess != undefined && !externalAccess) {
      updateMysqlUserPayload.externalAccess = false;
    }

    if (Object.keys(updateMysqlUserPayload).length == 1) {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
    } else {
      if (password) {
        await process.runStep("Updating mysql user password", async () => {
          const updatePasswordResponse =
            await this.apiClient.database.updateMysqlUserPassword({
              mysqlUserId,
              data: {
                password,
              },
            });
          assertSuccess(updatePasswordResponse);
        });
      }

      await process.runStep("Updating mysql user", async () => {
        const updateResponse = await this.apiClient.database.updateMysqlUser({
          mysqlUserId,
          data: updateMysqlUserPayload,
        });
        assertSuccess(updateResponse);
      });

      await process.complete(
        <Success>Your mysql user has successfully been updated.</Success>,
      );
    }
  }

  protected render(): ReactNode {
    return true;
  }
}
