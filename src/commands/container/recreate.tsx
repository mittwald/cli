import { ReactNode } from "react";
import { Args, Flags } from "@oclif/core";
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
import { assertStatus } from "@mittwald/api-client";

type Result = {
  serviceId: string;
};

export class Recreate extends ExecRenderBaseCommand<typeof Recreate, Result> {
  static summary = "Recreates a container.";
  static flags = {
    ...processFlags,
    ...projectFlags,
    pull: Flags.boolean({
      description: "pull the container image before recreating the container",
    }),
    force: Flags.boolean({
      description: "also recreate the container when it is already up to date",
    }),
  };
  static args = {
    "container-id": Args.string({
      description: "ID or short ID of the container to restart",
      required: true,
    }),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Recreating a container");
    const { pull, force } = this.flags;
    const [serviceId, stackId] = await withContainerAndStackId(
      this.apiClient,
      Recreate,
      this.flags,
      this.args,
      this.config,
    );

    if (pull) {
      await p.runStep("pulling image and recreating", async () => {
        const r = await this.apiClient.container.pullImageForService({
          serviceId,
          stackId,
        });

        assertSuccess(r);
      });
    } else {
      const service = await p.runStep("getting container status", async () => {
        const r = await this.apiClient.container.getService({
          serviceId,
          stackId,
        });

        assertStatus(r, 200);
        return r.data;
      });

      if (!service.requiresRecreate && !force) {
        p.addInfo("service is already up to date");
      } else {
        await p.runStep("recreating container", async () => {
          const r = await this.apiClient.container.restartService({
            serviceId,
            stackId,
          });

          assertSuccess(r);
        });
      }
    }

    await p.complete(
      <Success>
        Container <Value>{serviceId}</Value> was successfully recreated.
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
