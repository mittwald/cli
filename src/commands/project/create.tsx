import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { serverFlags } from "../../lib/resources/server/flags.js";
import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import React, { ReactNode } from "react";
import { Success } from "../../rendering/react/components/Success.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { waitFlags, waitUntil } from "../../lib/wait.js";
import Context from "../../lib/context/Context.js";
import { Value } from "../../rendering/react/components/Value.js";

export default class Create extends ExecRenderBaseCommand<
  typeof Create,
  { projectId: string }
> {
  static description = "Create a new project";

  static flags = {
    ...serverFlags,
    ...processFlags,
    ...waitFlags,
    description: Flags.string({
      char: "d",
      required: true,
      description: "A description for the project.",
    }),
    "update-context": Flags.boolean({
      description: "update the CLI context to use the newly created project",
      char: "c",
    }),
  };

  protected async exec(): Promise<{ projectId: string }> {
    const { flags } = await this.parse(Create);
    const { description } = flags;
    const process = makeProcessRenderer(flags, "Creating project");
    const serverId = await this.withServerId(Create);

    const stepCreating = process.addStep("creating a new project");

    const result = await this.apiClient.project.createProject({
      serverId,
      data: { description },
    });

    assertStatus(result, 201);

    stepCreating.complete();
    process.addInfo(`project ID: ${result.data.id}`);

    if (flags.wait) {
      const stepWaiting = process.addStep("waiting for project to be ready");

      await waitUntil(async () => {
        const projectResponse = await this.apiClient.project.getProject({
          projectId: result.data.id,
        });

        if (
          projectResponse.status === 200 &&
          projectResponse.data.readiness === "ready"
        ) {
          return true;
        }
      }, this.flags["wait-timeout"]);

      stepWaiting.complete();
    }

    const projectResult = await this.apiClient.project.getProject({
      projectId: result.data.id,
    });
    assertStatus(projectResult, 200);

    if (flags["update-context"]) {
      await process.runStep("updating CLI context", async () => {
        await new Context(this.apiClient, this.config).setProjectId(
          result.data.id,
        );
      });
    }

    await process.complete(
      <ProjectCreationSuccess shortId={projectResult.data.shortId} />,
    );

    return { projectId: result.data.id };
  }

  protected render({ projectId }: { projectId: string }): ReactNode {
    if (this.flags.quiet) {
      return projectId;
    }
  }
}

function ProjectCreationSuccess({ shortId }: { shortId: string }) {
  return (
    <Success>
      Your new project <Value>{shortId}</Value> was successfully created! 🚀
    </Success>
  );
}
