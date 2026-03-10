import { ReactNode } from "react";
import { Args } from "@oclif/core";
import { ExecRenderBaseCommand } from "../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../rendering/process/process_flags.js";
import { projectFlags } from "../lib/resources/project/flags.js";
import { withContainerAndStackId } from "../lib/resources/container/flags.js";
import assertSuccess from "../lib/apiutil/assert_success.js";
import { Success } from "../rendering/react/components/Success.js";
import { Value } from "../rendering/react/components/Value.js";

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

    await p.runStep("Setting up registry ...", async () => {
      const projectId = await this.withProjectId(Deploy);
      // 1. List registries and filter out default ones
      const registriesResp = await this.apiClient.container.listRegistries({ projectId });
      assertSuccess(registriesResp);

      const isDefaultRegistry = (r) => {
        const uri = r.uri || "";
        return uri.includes("docker.io") || uri.includes("ghcr.io") || uri.includes("gitlab.com");
      };
      let registry = registriesResp.data.find(r => !isDefaultRegistry(r));
      let created = false;
      let username, password, uri;

      if (!registry) {
        // 2. Generate random credentials
        username = `user_${Math.random().toString(36).slice(2, 10)}`;
        const { generatePasswordWithSpecialChars } = await import("../lib/util/password/generatePasswordWithSpecialChars.js");
        password = generatePasswordWithSpecialChars();

        // 3. Build registry URL: registry.p-XXXXXX.project.space
        const subdomain = `registry.${projectId}`;
        uri = `${subdomain}.project.space`;

        // 4. Create the registry container (service)
        const image = "ghcr.io/mittwald/docker-registry-authenticated:latest";
        const serviceName = "project-registry";
        const environment = {
          REGISTRY_AUTH_USERNAME: username,
          REGISTRY_AUTH_PASSWORD: password,
        };
        // Expose port 5000 (default for registry)
        const ports = ["5000:5000/tcp"];
        // Compose service request
        const serviceRequest = {
          image,
          description: "Project private registry",
          environment,
          ports,
        };
        // Add service to stack (projectId is used as stackId)
        const stackId = projectId;
        const updateResp = await this.apiClient.container.updateStack({
          stackId,
          data: { services: { [serviceName]: serviceRequest } },
        });

        assertSuccess(updateResp);

        // 5. Wait for container to be healthy
        let healthy = false;
        for (let i = 0; i < 20; i++) { // up to ~20s
          const services = (await this.apiClient.container.listServices({ projectId })).data;
          const regSvc = services.find(svc => svc.serviceName === serviceName);
          if (regSvc && regSvc.status === "healthy") {
            healthy = true;
            break;
          }
          await new Promise(res => setTimeout(res, 1000));
        }
        if (!healthy) throw new Error("Registry container did not become healthy in time");

        // 6. Register the registry entry
        const registryCreationPayload = {
          uri: `https://${uri}`,
          description: `Default registry for project ${projectId}`,
          credentials: { username, password },
        };
        const createResp = await this.apiClient.container.createRegistry({
          projectId,
          data: registryCreationPayload,
        });
        assertSuccess(createResp);
        registry = createResp.data;
        created = true;
      } else {
        username = registry.credentials?.username;
        password = registry.credentials?.password;
        uri = registry.uri;
      }

      // 7. Output credentials to user
      // XXX: How to show intermediate step results in process renderer?
      await p.info(
        <>
          <Success>
            {created ? "Created new registry:" : "Using existing registry:"}
            <br />
            URI: <Value>{uri}</Value>
            <br />
            Username: <Value>{username}</Value>
            <br />
            Password: <Value>{password || "(not retrievable)"}</Value>
          </Success>
        </>
      );
    });

    await p.runStep("Checking repository ...", async () => {
      /*
      check for Dockerfile and friends, create data-package for later use

      1.1 Check if dockerfile is present. If so, use that
      1.2 If no dockerfile is present, create a default one for static pages

      Return structured data for later use, e.g. build context, dockerfile path, etc.
      */

    });

    await p.runStep("Building Docker image ...", async () => {
      // Call docker image builder ( or docker build directly )
    });

    await p.runStep("Pushing docker image ...", async () => {
      // Call docker image builder ( or docker build directly )
    });

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
