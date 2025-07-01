import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { Flags } from "@oclif/core";
import type { MittwaldAPIV2 } from "@mittwald/api-client";

type ContainerCreateRegistry =
  MittwaldAPIV2.Components.Schemas.ContainerCreateRegistry;

type Result = {
  registryId: string;
};

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static summary = "Create a new container registry";
  static flags = {
    ...projectFlags,
    ...processFlags,
    uri: Flags.string({
      summary: "uri of the registry",
      required: true,
    }),
    description: Flags.string({
      summary: "description of the registry",
      required: true,
    }),
    username: Flags.string({
      summary: "username for registry authentication",
      required: false,
      dependsOn: ["password"],
    }),
    password: Flags.string({
      summary: "password for registry authentication",
      required: false,
      dependsOn: ["username"],
    }),
  };

  protected async exec(): Promise<Result> {
    const process = makeProcessRenderer(
      this.flags,
      "Creating a new container registry",
    );
    const projectId = await this.withProjectId(Create);
    const { uri, description, username, password } = this.flags;

    const registryCreationPayload: ContainerCreateRegistry = {
      uri,
      description,
    };

    if (username && password) {
      registryCreationPayload.credentials = {
        username,
        password,
      };
    }

    const { id: registryId } = await process.runStep(
      "creating container registry",
      async () => {
        const r = await this.apiClient.container.createRegistry({
          projectId,
          data: registryCreationPayload,
        });
        assertStatus(r, 201);
        return r.data;
      },
    );

    const registry = await process.runStep(
      "checking newly created container registry",
      async () => {
        const r = await this.apiClient.container.getRegistry({
          registryId,
        });
        assertStatus(r, 200);
        return r.data;
      },
    );

    await process.complete(
      <Success>
        The container registry "<Value>{registry.description}</Value>" at{" "}
        <Value>{registry.uri}</Value> was successfully created.
      </Success>,
    );

    return { registryId };
  }

  protected render({ registryId }: Result): ReactNode {
    if (this.flags.quiet) {
      return registryId;
    }
  }
}
