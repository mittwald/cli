import { ExecRenderBaseCommand } from "../../../../lib/basecommands/ExecRenderBaseCommand.js";
import { Flags, Args } from "@oclif/core";
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
  static args = {
    "database-id": Args.string({
      description: "MySQL User ID of the user to be updated",
    }),
  };
  static flags = {
    ...processFlags,
    "database-id": Flags.string({
      description: "MySQL User ID of the user to be updated",
    }),
    "access-level": Flags.string({
      description: "Access level for this mysql user",
      options: ["readonly", "full"],
    }),
    description: Flags.string({
      description: "Description of the mysql user",
    }),
    password: Flags.string({
      description: "Password used for authentication",
      exactlyOne: ["public-key", "password"],
    }),
    "access-ip-mask": Flags.string({
      description: "IP from wich external access will be exclusively allowed",
    }),
    "external-access": Flags.boolean({
      description: "Enable/Disable external access for this user.",
    }),
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(
      this.flags,
      "Creating a new mysql User",
    );

    // TODO: Implement withMySQLUserId

    let mysqlUserId: string = "";
    if (this.args["database-id"]) {
      mysqlUserId = this.args["database-id"];
    } else if (this.flags["database-id"]) {
      mysqlUserId = this.flags["database-id"];
    }

    const currentMysqlUserData = await this.apiClient.database.getMysqlUser({
      mysqlUserId,
    });
    assertSuccess(currentMysqlUserData);

    let currentAccessLevel: "full" | "readonly";

    if (currentMysqlUserData.data.accessLevel == "full") {
      currentAccessLevel = "full";
    } else if (currentMysqlUserData.data.accessLevel == "readonly") {
      currentAccessLevel = "readonly";
    } else {
      // This is more or less only a way to please the compiler
      // Not ever should it come to this or should this be used without
      // something way more critical being out of the order
      // TODO: no workaround
      currentAccessLevel = "readonly";
    }

    const {
      "access-level": accessLevel,
      description,
      password,
      "access-ip-mask": accessIpMask,
      "external-access": externalAccess,
    } = this.flags;

    const updateMysqlUserPayload: {
      accessLevel: "full" | "readonly";
      description: string;
      accessIpMask: string;
      externalAccess: boolean;
    } = {
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
    }

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

      if (accessLevel || description || accessIpMask || externalAccess) {
        await process.runStep("Updating mysql user", async () => {
          const updateResponse = await this.apiClient.database.updateMysqlUser({
            mysqlUserId,
            data: updateMysqlUserPayload,
          });
          assertSuccess(updateResponse);
        });
      }

      await process.complete(
        <Success>Your mysql user has successfully been updated.</Success>,
      );
    }
  }

  protected render(): ReactNode {
    return true;
  }
}
