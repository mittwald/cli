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
import { sshUserFlagDefinitions } from "../../lib/resources/ssh/flags.js";

type UpdateResult = void;
type SshUserUpdatePayload = Parameters<
  MittwaldAPIV2Client["sshsftpUser"]["sshUserUpdateSshUser"]
>[0]["data"];

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description = "Update an existing SSH user";
  static args = {
    "ssh-user-id": Args.string({
      description: "The ID of the SSH user to update",
      required: true,
    }),
  };
  static flags = {
    ...processFlags,
    ...expireFlags("SSH user", false),
    description: sshUserFlagDefinitions.description(),
    "public-key": sshUserFlagDefinitions["public-key"](),
    password: sshUserFlagDefinitions.password(),
    enable: Flags.boolean({
      exclusive: ["disable"],
      summary: "Enable the SSH user.",
      description:
        "Set the status of the SSH user to inactive. Access by this user will be disabled.",
    }),
    disable: Flags.boolean({
      exclusive: ["enable"],
      summary: "Disable the SSH user.",
      description:
        "Set the status of the SSH user to active. Access by this user will be enabled.",
    }),
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(this.flags, "Updating SSH user");
    const sshUserId = this.args["ssh-user-id"];

    const currentSshUser = await this.apiClient.sshsftpUser.sshUserGetSshUser({
      sshUserId,
    });
    assertSuccess(currentSshUser);

    const {
      description,
      "public-key": publicKey,
      password,
      expires,
      disable,
      enable,
    } = this.flags;

    const sshUserUpdatePayload: SshUserUpdatePayload = {};

    if (enable) {
      sshUserUpdatePayload.active = true;
    } else if (disable) {
      sshUserUpdatePayload.active = false;
    }

    if (description) {
      sshUserUpdatePayload.description = description;
    }

    if (expires) {
      sshUserUpdatePayload.expiresAt = expires.toString();
    }

    if (password) {
      sshUserUpdatePayload.password = password;
    }

    if (publicKey) {
      sshUserUpdatePayload.publicKeys = [
        {
          comment: "Public key set through CLI",
          key: publicKey,
        },
      ];
    }

    if (Object.keys(sshUserUpdatePayload).length == 0) {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
      return;
    } else {
      await process.runStep("Updating SSH user", async () => {
        const response = await this.apiClient.sshsftpUser.sshUserUpdateSshUser({
          sshUserId,
          data: sshUserUpdatePayload,
        });
        assertSuccess(response);
      });

      await process.complete(
        <Success>Your SSH user has successfully been updated.</Success>,
      );
      return;
    }
  }

  protected render(): ReactNode {
    return true;
  }
}
