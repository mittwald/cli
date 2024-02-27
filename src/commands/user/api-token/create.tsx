import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import parseDuration from "parse-duration";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Success } from "../../../rendering/react/components/Success.js";
import React from "react";
import { Newline, Text } from "ink";
import { Value } from "../../../rendering/react/components/Value.js";

type Roles =
  MittwaldAPIV2.Paths.V2UsersSelfApiTokens.Post.Parameters.RequestBody["roles"];

export default class Create extends ExecRenderBaseCommand<
  typeof Create,
  { token: string }
> {
  static description = "Create a new API token";

  static flags = {
    ...processFlags,
    description: Flags.string({
      description: "Description of the API token",
      required: true,
    }),
    "expires-in": Flags.string({
      description: "Expiration interval of the API token (example: 30d)",
    }),
    roles: Flags.string({
      description: "Roles of the API token",
      required: true,
      multiple: true,
      options: ["api_read", "api_write"],
    }),
  };

  private determineExpiration(input: string | undefined): Date | undefined {
    if (input === undefined) {
      return undefined;
    }

    const duration = parseDuration(input);
    if (duration === undefined) {
      throw new Error(`Could not parse duration ${input}`);
    }

    return new Date(Date.now() + duration);
  }

  protected async exec(): Promise<{ token: string }> {
    const { flags } = await this.parse(Create);
    const process = makeProcessRenderer(flags, "Creating an API token");
    const expiresAt = this.determineExpiration(flags["expires-in"]);

    const step = process.addStep("creating API token");
    try {
      const response = await this.apiClient.user.createApiToken({
        data: {
          description: flags.description,
          expiresAt: expiresAt?.toJSON(),
          roles: flags.roles as Roles,
        },
      });

      step.complete();

      assertStatus(response, 201);
      process.complete(
        <Success width={100}>
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
