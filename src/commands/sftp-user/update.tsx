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

type UpdateResult = void;
type SftpUserUpdatePayload = Parameters<
  MittwaldAPIV2Client["sshsftpUser"]["sftpUserUpdateSftpUser"]
>[0]["data"];

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description = "Update an existing sftp user";
  static args = {
    "sftp-user-id": Args.string({
      description: "The ID of the SFTP user to update",
      required: true,
    }),
  };
  static flags = {
    ...processFlags,
    ...expireFlags("SFTP user", false),
    description: Flags.string({
      description: "Set the SFTP users description",
    }),
    "public-key": Flags.string({
      description: "Public Key used for authentication",
      exclusive: ["password"],
    }),
    password: Flags.string({
      description: "Password used for authentication",
      exclusive: ["public-key"],
    }),
    "access-level": Flags.string({
      description: "Set access level privileges for the SFTP user",
      options: ["read", "full"],
    }),
    directories: Flags.directory({
      description: "Set directories to restrict the sftp users access to",
      multiple: true,
    }),
    disable: Flags.boolean({
      description: "Disable SFTP user",
      exclusive: ["enable"],
    }),
    enable: Flags.boolean({
      description: "Enable SFTP user",
      exclusive: ["disable"],
    }),
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(this.flags, "Updating SFTP user");
    const sftpUserId = this.args["sftp-user-id"];

    const {
      description,
      "public-key": publicKey,
      password,
      expires,
      "access-level": accessLevel,
      directories,
      disable,
      enable,
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
          comment: "Public key set through cli",
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

    if (Object.keys(sftpUserUpdatePayload).length == 1) {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
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
    }
  }

  protected render(): ReactNode {
    return true;
  }
}
