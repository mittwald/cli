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
  sftpUserId: string;
};

type SftpUserCreationPayload = Parameters<
  MittwaldAPIV2Client["sshsftpUser"]["sftpUserCreateSftpUser"]
>[0]["data"];

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static summary = "Create a new SFTP user";
  static flags = {
    ...projectFlags,
    ...processFlags,
    ...expireFlags("SFTP User", false),
    description: Flags.string({
      required: true,
      summary: "Description of SFTP user",
    }),
    "public-key": Flags.string({
      summary: "Public Key used for authentication",
      exactlyOne: ["public-key", "password"],
    }),
    password: Flags.string({
      summary: "Password used for authentication",
      exactlyOne: ["public-key", "password"],
    }),
    "access-level": Flags.string({
      description: "Set access level privileges for the SFTP user",
      options: ["read", "full"],
    }),
    directories: Flags.directory({
      required: true,
      description: "Set directories to restrict the SFTP users access to",
      multiple: true,
    }),
  };

  protected async exec(): Promise<Result> {
    const process = makeProcessRenderer(this.flags, "Creating a new SFTP User");
    const projectId = await this.withProjectId(Create);
    const {
      description,
      "public-key": publicKey,
      password,
      expires,
      "access-level": accessLevel,
      directories,
    } = this.flags;

    const sftpUserCreationPayload: SftpUserCreationPayload = {
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
      directories: [directories[0], ...directories.slice(1)],
    };

    if (expires) {
      sftpUserCreationPayload.expiresAt = expires.toString();
    }
    if (accessLevel == "read" || accessLevel == "full") {
      sftpUserCreationPayload.accessLevel = accessLevel;
    } else {
      sftpUserCreationPayload.accessLevel = undefined;
    }

    const { id: sftpUserId } = await process.runStep(
      "creating SFTP user",
      async () => {
        const r = await this.apiClient.sshsftpUser.sftpUserCreateSftpUser({
          projectId,
          data: sftpUserCreationPayload,
        });
        assertStatus(r, 201);
        return r.data;
      },
    );

    const sftpUser = await process.runStep(
      "checking newly created SFTP user",
      async () => {
        const r = await this.apiClient.sshsftpUser.sftpUserGetSftpUser({
          sftpUserId,
        });
        assertStatus(r, 200);
        return r.data;
      },
    );

    await process.complete(
      <Success>
        The sftp user "
        <Value>
          {sftpUser.userName} ({sftpUser.description})
        </Value>
        " was successfully created.
      </Success>,
    );

    return { sftpUserId };
  }

  protected render({ sftpUserId }: Result): ReactNode {
    if (this.flags.quiet) {
      return sftpUserId;
    }
  }
}