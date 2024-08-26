import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
type UpdateResult = void;

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
    expires: Flags.string({
      description: "Date at wich the SFTP user will be disabled automatically",
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

    const updateSftpUserPayload: {
      accessLevel?: "read" | "full" | undefined;
      active?: boolean | undefined;
      description?: string | undefined;
      directories?: [string, ...string[]] | undefined;
      expiresAt?: string | undefined;
      password?: string | undefined;
      publicKeys?:
        | MittwaldAPIV2.Components.Schemas.SshuserPublicKey[]
        | undefined;
    } = {};

    if (enable) {
      updateSftpUserPayload.active = true;
    } else if (disable) {
      updateSftpUserPayload.active = false;
    }

    if (description) {
      updateSftpUserPayload.description = description;
    }

    if (expires) {
      updateSftpUserPayload.expiresAt = expires;
    }

    if (password) {
      updateSftpUserPayload.password = password;
    }

    if (publicKey) {
      updateSftpUserPayload.publicKeys = [
        {
          comment: "Public key set through cli",
          key: publicKey,
        },
      ];
    }

    if (accessLevel == "read" || accessLevel == "full") {
      updateSftpUserPayload.accessLevel = accessLevel;
    } else {
      updateSftpUserPayload.accessLevel = undefined;
    }

    if (directories) {
      updateSftpUserPayload.directories = [
        directories[0],
        ...directories.slice(1),
      ];
    }

    if (Object.keys(updateSftpUserPayload).length == 1) {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
    } else {
      await process.runStep("Updating SFTP user", async () => {
        const response =
          await this.apiClient.sshsftpUser.sftpUserUpdateSftpUser({
            sftpUserId,
            data: updateSftpUserPayload,
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
