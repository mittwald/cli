import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { serverFlags, withServerId } from "../../lib/server/flags.js";
import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import { Text } from "ink";
import React, { ReactNode } from "react";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { waitUntil } from "../../lib/wait.js";
import { Context } from "../../lib/context.js";

export default class Create extends ExecRenderBaseCommand<
  typeof Create,
  { projectId: string }
> {
  static description = "Get the details of a project";

  static flags = {
    ...serverFlags,
    ...processFlags,
    description: Flags.string({
      char: "d",
      required: true,
      description: "A description for the project.",
    }),
    wait: Flags.boolean({
      char: "w",
      description: "Wait for the project to be ready.",
    }),
    "update-context": Flags.boolean({
      description: "Update the CLI context to use the newly created project",
    }),
  };

  protected async exec(): Promise<{ projectId: string }> {
    const { flags } = await this.parse(Create);
    const { description } = flags;
    const process = makeProcessRenderer(flags, "Creating project");
    const serverId = await withServerId(this.apiClient, flags, {}, this.config);

    const stepCreating = process.addStep(<Text>creating a new project</Text>);

    const result = await this.apiClient.project.createProject({
      pathParameters: { serverId },
      data: { description },
    });

    assertStatus(result, 201);
    const eventId = result.headers["etag"];

    stepCreating.complete();
    process.addInfo(
      <Text>
        project ID: <Value>{result.data.id}</Value>
      </Text>,
    );

    if (flags.wait) {
      const stepWaiting = process.addStep(
        <Text>waiting for project to be ready</Text>,
      );

      await waitUntil(async () => {
        const projectResponse = await this.apiClient.project.getProject({
          pathParameters: { id: result.data.id },
          headers: { "if-event-reached": eventId },
        });

        if (
          projectResponse.status === 200 &&
          projectResponse.data.readiness === "ready"
        ) {
          return true;
        }
      });

      stepWaiting.complete();
    }

    if (flags["update-context"]) {
      await process.runStep("updating CLI context", async () => {
        await new Context(this.config).setProjectId(result.data.id);
      });
    }

    process.complete(
      <Success>Your new project was successfully created! 🚀</Success>,
    );
    return { projectId: result.data.id };
  }

  protected render({ projectId }: { projectId: string }): ReactNode {
    if (this.flags.quiet) {
      return projectId;
    }
  }
}
