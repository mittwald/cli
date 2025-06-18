import { ReactNode } from "react";
import { Args } from "@oclif/core";
import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { withContainerAndStackId } from "../../lib/resources/container/flags.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";

type Result = {
  serviceId: string;
};

export class Restart extends ExecRenderBaseCommand<typeof Restart, Result> {
  static summary = "Restarts a container.";
  static flags = {
    ...processFlags,
    ...projectFlags,
  };
  static args = {
    "container-id": Args.string({
      description: "ID or short ID of the container to restart",
      required: true,
    }),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Restarting a container");
    const [serviceId, stackId] = await withContainerAndStackId(
      this.apiClient,
      Restart,
      this.flags,
      this.args,
      this.config,
    );

    await p.runStep("restarting container", async () => {
      const r = await this.apiClient.container.restartService({
        serviceId,
        stackId,
      });

      assertSuccess(r);
    });

    await p.complete(
      <Success>
        Container <Value>{serviceId}</Value> was successfully restarted.
      </Success>,
    );

    return { serviceId };
  }

  protected render({ serviceId }: Result): ReactNode {
    if (this.flags.quiet) {
      return serviceId;
    }
  }
}
