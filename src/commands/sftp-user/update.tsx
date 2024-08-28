import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { expireFlags } from "../../lib/flags/expireFlags.js";
import { sftpUserFlagDefinitions } from "../../lib/resources/sftp/flags.js";

type UpdateResult = void;
type SftpUserUpdatePayload = Parameters<
  MittwaldAPIV2Client["sshsftpUser"]["sftpUserUpdateSftpUser"]
>[0]["data"];

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description = "Update an existing SFTP user";
  static args = {
    "sftp-user-id": Args.string({
      description: "The ID of the SFTP user to update",
      required: true,
    }),
  };
  static flags = {
    ...processFlags,
    ...expireFlags("SFTP user", false),
    description: sftpUserFlagDefinitions.description(),
    "public-key": sftpUserFlagDefinitions["public-key"]({
      exclusive: ["password"],
    }),
    password: sftpUserFlagDefinitions.password({
      exclusive: ["public-key"],
    }),
    "access-level": sftpUserFlagDefinitions["access-level"](),
    directories: sftpUserFlagDefinitions.directories(),
    enable: Flags.boolean({
      exclusive: ["disable"],
      summary: "Enable the SFTP user.",
      description:
        "Set the status of the SFTP user to inactive. Access by this user will be disabled.",
    }),
    disable: Flags.boolean({
      exclusive: ["enable"],
      summary: "Disable the SFTP user.",
      description:
        "Set the status of the SFTP user to active. Access by this user will be enabled.",
    }),
  };

  protected async exec(): Promise<void> {
    const sftpUserId = this.args["sftp-user-id"];
    const process = makeProcessRenderer(this.flags, "Updating SFTP user");

    const {
      description,
      "public-key": publicKey,
      password,
      expires,
      "access-level": accessLevel,
      directories,
      enable,
      disable,
    } = this.flags;

    const sftpUserUpdatePayload: SftpUserUpdatePayload = {};

    if (enable) {
      sftpUserUpdatePayload.active = true;
    } else if (disable) {
      sftpUserUpdatePayload.active = false;
    }

    if (description) {
      sftpUserUpdatePayload.description = description;
    }

    if (expires) {
      sftpUserUpdatePayload.expiresAt = expires.toString();
    }

    if (password) {
      sftpUserUpdatePayload.password = password;
    }

    if (publicKey) {
      sftpUserUpdatePayload.publicKeys = [
        {
          comment: "Public key set through CLI",
          key: publicKey,
        },
      ];
    }

    if (accessLevel == "read" || accessLevel == "full") {
      sftpUserUpdatePayload.accessLevel = accessLevel;
    }

    if (directories) {
      sftpUserUpdatePayload.directories = [
        directories[0],
        ...directories.slice(1),
      ];
    }

    if (Object.keys(sftpUserUpdatePayload).length == 0) {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
      return;
    } else {
      await process.runStep("Updating SFTP user", async () => {
        const response =
          await this.apiClient.sshsftpUser.sftpUserUpdateSftpUser({
            sftpUserId,
            data: sftpUserUpdatePayload,
          });
        assertSuccess(response);
      });

      await process.complete(
        <Success>Your SFTP user has successfully been updated.</Success>,
      );
      return;
    }
  }

  protected render(): ReactNode {
    return true;
  }
}
