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

export class Stop extends ExecRenderBaseCommand<typeof Stop, Result> {
  static summary = "Stops a running container.";
  static flags = {
    ...processFlags,
    ...projectFlags,
  };
  static args = {
    "container-id": Args.string({
      description: "ID or short ID of the container to stop",
      required: true,
    }),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Stopping a container");
    const [serviceId, stackId] = await withContainerAndStackId(
      this.apiClient,
      Stop,
      this.flags,
      this.args,
      this.config,
    );

    await p.runStep("stopping container", async () => {
      const r = await this.apiClient.container.stopService({
        serviceId,
        stackId,
      });

      assertSuccess(r);
    });

    await p.complete(
      <Success>
        Container <Value>{serviceId}</Value> was successfully stopped.
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
