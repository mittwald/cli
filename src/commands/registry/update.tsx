import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Text } from "ink";
import { ProcessRenderer } from "../../rendering/process/process.js";

type ContainerUpdateRegistry =
  MittwaldAPIV2.Components.Schemas.ContainerUpdateRegistry;

type UpdateResult = void;

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description = "Update an existing container registry";
  static args = {
    "registry-id": Args.string({
      summary: "id of the container registry to update",
      required: true,
    }),
  };
  static flags = {
    ...processFlags,
    description: Flags.string({
      summary: "new description for the registry",
    }),
    uri: Flags.string({
      summary: "new uri for the registry",
    }),
    username: Flags.string({
      summary: "username for registry authentication",
    }),
    password: Flags.string({
      summary: "password for registry authentication",
      description:
        "If omitted but username is provided, the command will prompt interactively for a password.\n\nCAUTION: providing this flag may log your password in your shell history!",
    }),
  };

  protected async exec(): Promise<void> {
    const registryId = this.args["registry-id"];
    const process = makeProcessRenderer(
      this.flags,
      "Updating container registry",
    );

    const { description, uri, username } = this.flags;

    const registryUpdatePayload: ContainerUpdateRegistry = {};

    if (description) {
      registryUpdatePayload.description = description;
    }

    if (uri) {
      registryUpdatePayload.uri = uri;
    }

    if (username) {
      const password = await this.getPassword(process);
      registryUpdatePayload.credentials = {
        username,
        password,
      };
    }

    if (Object.keys(registryUpdatePayload).length == 0) {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
      return;
    }

    await process.runStep("Updating container registry", async () => {
      const response = await this.apiClient.container.updateRegistry({
        registryId,
        data: registryUpdatePayload,
      });
      assertSuccess(response);
    });

    await process.complete(
      <Success>Your container registry has successfully been updated.</Success>,
    );
    return;
  }

  protected render(): ReactNode {
    return true;
  }

  private async getPassword(process: ProcessRenderer): Promise<string> {
    if (this.flags.password) {
      return this.flags.password;
    }

    return await process.addInput(<Text>enter registry password</Text>, true);
  }
}
