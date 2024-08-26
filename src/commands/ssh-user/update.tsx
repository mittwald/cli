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
  static description = "Update an existing SSH user";
  static args = {
    "ssh-user-id": Args.string({
      description: "The ID of the SSH user to update",
      required: true,
    }),
  };
  static flags = {
    ...processFlags,
    description: Flags.string({
      description: "Set SSH user description",
    }),
    "public-key": Flags.string({
      summary: "Public Key used for authentication",
      exactlyOne: ["public-key", "password"],
    }),
    password: Flags.string({
      summary: "Password used for authentication",
      exactlyOne: ["public-key", "password"],
    }),
    expires: Flags.string({
      summary: "Date at which the user will be disabled automatically",
    }),
    disable: Flags.boolean({
      description: "Disable SSH user",
      exclusive: ["enable"],
    }),
    enable: Flags.boolean({
      description: "Enable SSH user",
      exclusive: ["disable"],
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

    const updateSshUserPayload: {
      active?: boolean | undefined;
      description?: string | undefined;
      expiresAt?: string | undefined;
      password?: string | undefined;
      publicKeys?:
        | MittwaldAPIV2.Components.Schemas.SshuserPublicKey[]
        | undefined;
    } = {};

    if (enable) {
      updateSshUserPayload.active = true;
    } else if (disable) {
      updateSshUserPayload.active = false;
    }

    if (description) {
      updateSshUserPayload.description = description;
    }

    if (expires) {
      updateSshUserPayload.expiresAt = expires;
    }

    if (password) {
      updateSshUserPayload.password = password;
    }

    if (publicKey) {
      updateSshUserPayload.publicKeys = [
        {
          comment: "Public key set through CLI",
          key: publicKey,
        },
      ];
    }

    if (Object.keys(updateSshUserPayload).length == 1) {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
    } else {
      await process.runStep("Updating SSH user", async () => {
        const response = await this.apiClient.sshsftpUser.sshUserUpdateSshUser({
          sshUserId,
          data: updateSshUserPayload,
        });
        assertSuccess(response);
      });

      await process.complete(
        <Success>Your SSH user has successfully been updated.</Success>,
      );
    }
  }

  protected render(): ReactNode {
    return true;
  }
}
