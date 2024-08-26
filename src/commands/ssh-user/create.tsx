import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";

import { projectFlags } from "../../lib/resources/project/flags.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { expireFlags } from "../../lib/flags/expireFlags.js";

type Result = {
  sshUserId: string;
};

type SshUserCreationPayload = Parameters<
  MittwaldAPIV2Client["sshsftpUser"]["sshUserCreateSshUser"]
>[0]["data"];

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static summary = "Create a new SSH user";
  static flags = {
    ...projectFlags,
    ...processFlags,
    ...expireFlags("SSH user", false),
    description: Flags.string({
      required: true,
      summary: "Description of SSH user",
    }),
    "public-key": Flags.string({
      summary: "Public Key used for authentication",
      exactlyOne: ["public-key", "password"],
    }),
    password: Flags.string({
      summary: "Password used for authentication",
      exactlyOne: ["public-key", "password"],
    }),
  };

  protected async exec(): Promise<Result> {
    const process = makeProcessRenderer(this.flags, "Creating a new SSH user");
    const projectId = await this.withProjectId(Create);
    const {
      description,
      "public-key": publicKey,
      password,
      expires,
    } = this.flags;

    const sshUserCreationPayload: SshUserCreationPayload = {
      authentication: password
        ? { password }
        : {
            publicKeys: [
              {
                comment: "Public key set through CLI",
                key: publicKey ? publicKey : "",
              },
            ],
          },
      // TODO: simplify or infer
      description,
    };

    if (expires) {
      sshUserCreationPayload.expiresAt = expires.toString();
    }

    const { id: sshUserId } = await process.runStep(
      "creating SSH user",
      async () => {
        const r = await this.apiClient.sshsftpUser.sshUserCreateSshUser({
          projectId,
          data: sshUserCreationPayload,
        });
        assertStatus(r, 201);
        return r.data;
      },
    );

    const sshUser = await process.runStep(
      "checking newly created SSH user",
      async () => {
        const r = await this.apiClient.sshsftpUser.sshUserGetSshUser({
          sshUserId,
        });
        assertStatus(r, 200);
        return r.data;
      },
    );

    process.complete(
      <Success>
        The ssh user "
        <Value>
          {sshUser.userName} ({sshUser.description})
        </Value>
        " was successfully created.
      </Success>,
    );

    return { sshUserId };
  }

  protected render({ sshUserId }: Result): ReactNode {
    if (this.flags.quiet) {
      return sshUserId;
    }
  }
}
