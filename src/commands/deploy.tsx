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

export class Deploy extends ExecRenderBaseCommand<typeof Deploy, Result> {
  static summary = "Deploys a new container.";
  static flags = {
    ...processFlags,
    ...projectFlags,
  };
  static args = {
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Deploying ...");

    /* prepare actual arguments, use "withProjectID"

    const [serviceId, stackId] = await withContainerAndStackId(
      this.apiClient,
      Stop,
      this.flags,
      this.args,
      this.config,
    );
    */

    await p.runStep("Setting up registry ...", async () => {
      /*
      1.1 check if we already find docker registry container. if present,
          pick credentials ( reigstry_user and registry_password) from environment.
      1.2 if not present, create a new registry container, and generate credentials at random

      2. Check domain via name, assuma domain subdomain of porject like "registry.p-XXXXX.…"
      2.1 Check if registry container has a domain already, if so use that
      2.2 if not, create a new domain for registry container and link them together

      3.1 Check if registry is actually used in project, if so do nothing
      3.2 if not, add registry to project

      */
    });

    await p.runStep("Checking repository ...", async () => {
      /*
      check for Dockerfile and friends, create data-package for later use

      1.1 Check if dockerfile is present. If so, use that
      1.2 If no dockerfile is present, create a default one for static pages

      Return structured data for later use, e.g. build context, dockerfile path, etc.
      */

    }

    await p.runStep("Building Docker image ...", async () => {
      // Call docker image builder ( or docker build directly )
    }

    await p.runStep("Pushing docker image ...", async () => {
      // Call docker image builder ( or docker build directly )
    }

    await p.runStep("deploying ...", async () => {
      // main sequence of commands go here! OR even make several steps in order to improve UI/UX, e.g. long running steps

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
