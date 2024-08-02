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
import { MittwaldAPIV2 } from "@mittwald/api-client";

type Result = {
  sftpUserId: string;
};

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static summary = "Create a new sftp user";
  static flags = {
    ...projectFlags,
    ...processFlags,
    description: Flags.string({
      required: true,
      summary: "Description of sftp user",
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
      summary: "Date at wich the sftp user get disabled automatically",
    }),
    "access-level": Flags.string({
      description: "Set access level privileges for the sftp user",
      options: ["read", "full"],
    }),
    directories: Flags.directory({
      required: true,
      description: "Set directories to restrict the sftp users access to",
      multiple: true,
    }),
  };

  protected async exec(): Promise<Result> {
    const process = makeProcessRenderer(this.flags, "Creating a new sftp User");
    const projectId = await this.withProjectId(Create);
    const {
      description,
      "public-key": publicKey,
      password,
      expires,
      "access-level": accessLevel,
      directories,
    } = this.flags;

    const createSftpUserPayload: {
      authentication:
        | { password: string }
        | { publicKeys: MittwaldAPIV2.Components.Schemas.SshuserPublicKey[] };
      description: string;
      directories: [string, ...string[]];
      accessLevel?: "read" | "full" | undefined;
      expiresAt?: string | undefined;
    } = {
      authentication: password
        ? { password }
        : {
            publicKeys: [
              {
                comment: "Public key set through cli",
                key: publicKey ? publicKey : "",
              },
            ],
          },
      description,
      directories: [directories[0], ...directories.slice(1)],
    };

    if (expires) {
      createSftpUserPayload.expiresAt = expires;
    }

    if (accessLevel == "read" || accessLevel == "full") {
      createSftpUserPayload.accessLevel = accessLevel;
    } else {
      createSftpUserPayload.accessLevel = undefined;
    }

    const { id: sftpUserId } = await process.runStep(
      "creating SHH user",
      async () => {
        const r = await this.apiClient.sshsftpUser.sftpUserCreateSftpUser({
          projectId,
          data: createSftpUserPayload,
        });
        assertStatus(r, 201);
        return r.data;
      },
    );

    const sftpUser = await process.runStep(
      "checking newly created sftp user",
      async () => {
        const r = await this.apiClient.sshsftpUser.sftpUserGetSftpUser({
          sftpUserId,
        });
        assertStatus(r, 200);
        return r.data;
      },
    );

    process.complete(
      <Success>
        The sftp user "<Value>{sftpUser.description}</Value>" was successfully
        created.
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
