import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Success } from "../../../rendering/react/components/Success.js";
import React from "react";
import { Newline, Text } from "ink";
import { Value } from "../../../rendering/react/components/Value.js";
import { expireFlags } from "../../../lib/flags/expireFlags.js";

type Roles =
  MittwaldAPIV2.Paths.V2UsersSelfApiTokens.Post.Parameters.RequestBody["roles"];

const roleFlags = Flags.custom<Roles>({
  options: ["api_read", "api_write"],
});

export default class Create extends ExecRenderBaseCommand<
  typeof Create,
  { token: string }
> {
  static description = "Create a new API token";

  static flags = {
    ...processFlags,
    ...expireFlags("API token", false),
    description: Flags.string({
      description: "description of the API token",
      required: true,
    }),
    roles: roleFlags({
      description: "roles of the API token",
      required: true,
      multiple: true,
    }),
  };

  protected async exec(): Promise<{ token: string }> {
    const process = makeProcessRenderer(this.flags, "Creating an API token");
    const { description, roles, expires } = this.flags;

    const step = process.addStep("creating API token");
    try {
      const response = await this.apiClient.user.createApiToken({
        data: {
          description,
          expiresAt: expires?.toJSON(),
          roles,
        },
      });

      step.complete();

      assertStatus(response, 201);
      process.complete(
        <Success>
          <Text>
            API token successfully created. Have fun. 🥳
            <Newline count={2} />
            This is your API token; make sure to store it somewhere safe:
            <Newline count={1} />
            <Value>{response.data.token}</Value>
          </Text>
        </Success>,
      );
      return { token: response.data.token };
    } catch (e) {
      process.error(e);
      throw e;
    }
  }

  protected render() {
    return null;
  }
}
