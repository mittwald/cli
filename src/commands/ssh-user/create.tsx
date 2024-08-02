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
  sshUserId: string;
};

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static summary = "Create a new ssh user";
  static flags = {
    ...projectFlags,
    ...processFlags,
    description: Flags.string({
      required: true,
      summary: "Description of ssh user",
    }),
    expires: Flags.string({
      summary: "Date at wich the ssh user get disabled automatically",
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
    const process = makeProcessRenderer(this.flags, "Creating a new ssh user");
    const projectId = await this.withProjectId(Create);
    const {
      description,
      "public-key": publicKey,
      password,
      expires,
    } = this.flags;

    const createSshUserPayload: {
      authentication:
        | { password: string }
        | { publicKeys: MittwaldAPIV2.Components.Schemas.SshuserPublicKey[] };
      description: string;
      expiresAt?: string;
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
    };

    if (expires) {
      createSshUserPayload.expiresAt = expires;
    }

    const { id: sshUserId } = await process.runStep(
      "creating ssh user",
      async () => {
        const r = await this.apiClient.sshsftpUser.sshUserCreateSshUser({
          projectId,
          data: createSshUserPayload,
        });
        assertStatus(r, 201);
        return r.data;
      },
    );

    const sshUser = await process.runStep(
      "checking newly created ssh user",
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
        The ssh user "<Value>{sshUser.description}</Value>" was successfully
        created.
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
