import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Args } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import { projectFlags } from "../../lib/resources/project/flags.js";

type Result = {
  volumeName: string;
  stackId: string;
};

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static summary = "Create a new volume";
  static description =
    "Creates a new named volume in the project stack. The volume will be available for use by containers.";

  static flags = {
    ...projectFlags,
    ...processFlags,
  };

  static args = {
    name: Args.string({
      description: "name of the volume to create",
      required: true,
    }),
  };

  protected async exec(): Promise<Result> {
    const process = makeProcessRenderer(this.flags, "Creating a new volume");
    const projectId = await this.withProjectId(Create);
    const stackId = projectId; // In mStudio, project and stack are the same for volumes
    const { name: volumeName } = this.args;

    // Get current stack state
    const currentStack = await process.runStep(
      "getting current stack state",
      async () => {
        const r = await this.apiClient.container.getStack({ stackId });
        assertStatus(r, 200);
        return r.data;
      },
    );

    // Check if volume already exists
    if ((currentStack.volumes || []).some((v) => v.name === volumeName)) {
      throw new Error(`Volume "${volumeName}" already exists`);
    }

    // Update stack to include the new volume
    await process.runStep("creating volume", async () => {
      const r = await this.apiClient.container.updateStack({
        stackId,
        data: {
          volumes: {
            [volumeName]: { name: volumeName },
          },
        },
      });
      assertStatus(r, 200);
    });

    await process.complete(
      <Success>
        Volume <Value>{volumeName}</Value> was successfully created.
      </Success>,
    );

    return { volumeName, stackId };
  }

  protected render({ volumeName }: Result): ReactNode {
    if (this.flags.quiet) {
      return volumeName;
    }
  }
}
