import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Flags } from "@oclif/core";
import { Success } from "../../rendering/react/components/Success.js";

type UpdateResult = void;

import {
  projectArgs,
  projectFlags,
} from "../../lib/resources/project/flags.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description = "Update an existing project";
  static args = { ...projectArgs };
  static flags = {
    ...processFlags,
    ...projectFlags,
    description: Flags.string({
      description: "Set the project description",
    }),
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(this.flags, "Updating project");
    const projectId = await this.withProjectId(Update);

    const { description } = this.flags;

    if (!description) {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
    } else {
      await process.runStep("Updating project user", async () => {
        const response = await this.apiClient.project.updateProjectDescription({
          projectId,
          data: {
            description,
          },
        });
        assertSuccess(response);
      });

      await process.complete(
        <Success>Your project has successfully been updated.</Success>,
      );
    }
  }

  protected render(): ReactNode {
    return true;
  }
}
