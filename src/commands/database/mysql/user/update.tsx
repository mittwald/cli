import { ExecRenderBaseCommand } from "../../../../lib/basecommands/ExecRenderBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../../rendering/process/process_flags.js";
import { Success } from "../../../../rendering/react/components/Success.js";
import assertSuccess from "../../../../lib/apiutil/assert_success.js";
import type { MittwaldAPIV2Client } from "@mittwald/api-client";
import { mysqlUserFlagDefinitions } from "../../../../lib/resources/database/mysql/user/flags.js";
type UpdateResult = void;
type MyQSLUserUpdateData = Parameters<
  MittwaldAPIV2Client["database"]["updateMysqlUser"]
>[0]["data"];

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description = "Updates an existing MySQL user";
  static args = {
    "user-id": Args.string({
      required: true,
      description: "ID of the MySQL user to update.",
    }),
  };
  static flags = {
    ...processFlags,
    "access-level": mysqlUserFlagDefinitions["access-level"](),
    description: mysqlUserFlagDefinitions.description(),
    password: mysqlUserFlagDefinitions.password(),
    "access-ip-mask": mysqlUserFlagDefinitions["access-ip-mask"](),
    "enable-external-access": Flags.boolean({
      exclusive: ["disable-external-access"],
      summary: "Enable external access.",
      description:
        "Set the external access for this MySQL user to enabled. External access by this user will possible. " +
        "External access can be restricted to certain IP addresses through the 'access-ip-mask'-flag.",
    }),
    "disable-external-access": Flags.boolean({
      exclusive: ["enable-external-access"],
      summary: "Disable external access.",
      description:
        "Set the external access for this MySQL user to disabled. External access by this user will not be possible. ",
    }),
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(this.flags, "Updating MySQL user");
    const mysqlUserId = this.args["user-id"];
    let changesNecessary: boolean = false;

    const {
      "access-level": accessLevel,
      description,
      password,
      "access-ip-mask": accessIpMask,
      "enable-external-access": enableExternalAccess,
      "disable-external-access": disableExternalAccess,
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

    let externalAccessActive: boolean;
    if (enableExternalAccess) {
      externalAccessActive = true;
    } else if (disableExternalAccess) {
      externalAccessActive = false;
    } else {
      externalAccessActive = currentMysqlUserData.data
        .externalAccess as boolean;
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
      externalAccess: externalAccessActive,
    };

    if (password) {
      changesNecessary = true;
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

    if (
      accessLevel ||
      description ||
      accessIpMask ||
      enableExternalAccess ||
      disableExternalAccess
    ) {
      changesNecessary = true;
      await process.runStep("Updating MySQL user", async () => {
        const updateResponse = await this.apiClient.database.updateMysqlUser({
          mysqlUserId,
          data: updateMysqlUserPayload,
        });
        assertSuccess(updateResponse);
      });
    }

    if (changesNecessary) {
      await process.complete(
        <Success>Your mysql user has successfully been updated.</Success>,
      );
      return;
    } else {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
      return;
    }
  }

  protected render(): ReactNode {
    return true;
  }
}
