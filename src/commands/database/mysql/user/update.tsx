import { ExecRenderBaseCommand } from "../../../../lib/basecommands/ExecRenderBaseCommand.js";
import { Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../../rendering/process/process_flags.js";
import { Success } from "../../../../rendering/react/components/Success.js";
import assertSuccess from "../../../../lib/apiutil/assert_success.js";
import type { MittwaldAPIV2Client } from "@mittwald/api-client";
type UpdateResult = void;
type MyQSLUserUpdateData = Parameters<
  MittwaldAPIV2Client["database"]["updateMysqlUser"]
>[0]["data"];

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description = "Create a new mysql user";
  static flags = {
    ...processFlags,
    "mysql-user-id": Flags.string({
      required: true,
      description: "MySQL User ID of the user to be updated",
    }),
    "access-level": Flags.string({
      description: "Access level for this MySQL user",
      options: ["readonly", "full"],
    }),
    description: Flags.string({
      description: "Description of the MySQL user",
    }),
    password: Flags.string({
      description: "Password used for authentication",
    }),
    "access-ip-mask": Flags.string({
      description: "IP from which external access will be exclusively allowed",
    }),
    "external-access": Flags.boolean({
      description: "Enable/Disable external access for this user.",
    }),
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(
      this.flags,
      "Creating a new MySQL User",
    );

    const {
      "mysql-user-id": mysqlUserId,
      "access-level": accessLevel,
      description,
      password,
      "access-ip-mask": accessIpMask,
      "external-access": externalAccess,
    } = this.flags;

    const currentMysqlUserData = await this.apiClient.database.getMysqlUser({
      mysqlUserId,
    });
    assertSuccess(currentMysqlUserData);

    let currentAccessLevel: "full" | "readonly";
    if (currentMysqlUserData.data.accessLevel == "full") {
      currentAccessLevel = "full";
    } else {
      currentAccessLevel = "readonly";
    }

    const updateMysqlUserPayload: Required<MyQSLUserUpdateData> = {
      accessLevel:
        accessLevel == "full" || accessLevel == "readonly"
          ? accessLevel
          : currentAccessLevel,
      description:
        typeof description === "string"
          ? description
          : (currentMysqlUserData.data.description as string),
      accessIpMask: accessIpMask
        ? accessIpMask
        : (currentMysqlUserData.data.accessIpMask as string),
      externalAccess: externalAccess
        ? externalAccess
        : (currentMysqlUserData.data.externalAccess as boolean),
    };

    if (Object.keys(updateMysqlUserPayload).length == 1) {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
      return;
    }

    if (password) {
      await process.runStep("Updating MySQL user password", async () => {
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

    if (accessLevel || description || accessIpMask || externalAccess) {
      await process.runStep("Updating MySQL user", async () => {
        const updateResponse = await this.apiClient.database.updateMysqlUser({
          mysqlUserId,
          data: updateMysqlUserPayload,
        });
        assertSuccess(updateResponse);
      });

      await process.complete(
        <Success>Your mysql user has successfully been updated.</Success>,
      );
      return;
    }
  }

  protected render(): ReactNode {
    return true;
  }
}
