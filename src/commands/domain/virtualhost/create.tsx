import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { projectFlags } from "../../../lib/resources/project/flags.js";
import {
  buildIngressPaths,
  pathMappingFlags,
} from "../../../lib/resources/domain/virtualhost/flags.js";
import { ReactNode } from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { Flags } from "@oclif/core";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Success } from "../../../rendering/react/components/Success.js";
import { Value } from "../../../rendering/react/components/Value.js";
import { waitUntil } from "../../../lib/wait.js";
import { Box } from "ink";
import { DnsValidationErrors } from "../../../rendering/react/components/Ingress/DnsValidationErrors.js";

type IngressIngress = MittwaldAPIV2.Components.Schemas.IngressIngress;

type CreateResult = {
  ingress: IngressIngress;
};

export default class Create extends ExecRenderBaseCommand<
  typeof Create,
  CreateResult
> {
  static description = "Create a new ingress";
  static examples = [
    {
      description:
        "Create a new ingress, with the root path mapping to your project's root directory",
      command:
        "<%= config.bin %> <%= command.id %> --hostname mw.example --path-to-dir /:/",
    },
    {
      description: "Create a new ingress, with the root path mapping to an app",
      command:
        "<%= config.bin %> <%= command.id %> --hostname mw.example --path-to-app /:3ecaf1a9-6eb4-4869-b811-8a13c3a2e745",
    },
    {
      description: "Create a new ingress, with the root path mapping to a URL",
      command:
        "<%= config.bin %> <%= command.id %> --hostname mw.example --path-to-url /:https://redirect.example",
    },
  ];
  static flags = {
    ...processFlags,
    ...projectFlags,
    hostname: Flags.string({
      description: "the hostname of the ingress",
      required: true,
    }),
    ...pathMappingFlags,
  };

  protected async exec(): Promise<CreateResult> {
    const projectId = await this.withProjectId(Create);
    const process = makeProcessRenderer(this.flags, "Creating a new ingress");
    const { hostname } = this.flags;
    const paths = buildIngressPaths(this.flags);

    const { id: ingressId } = await process.runStep(
      "creating ingress",
      async () => {
        const response = await this.apiClient.domain.ingressCreateIngress({
          data: {
            projectId,
            hostname,
            paths,
          },
        });

        assertStatus(response, 201);

        return response.data;
      },
    );

    const ingress = await process.runStep(
      "waiting for ingress to be ready",
      async (): Promise<IngressIngress> => {
        return await waitUntil(async () => {
          const response = await this.apiClient.domain.ingressGetIngress({
            ingressId,
          });

          if (response.status !== 200 || response.data.ips.v4.length === 0) {
            return null;
          }

          return response.data;
        });
      },
    );

    await process.complete(
      <Success>
        You virtual host for <Value>{hostname}</Value> was successfully created!
        🚀{" "}
        {ingress.ips.v4.length > 0
          ? "Please point your DNS records to the following IP addresses: " +
            ingress.ips.v4.join(", ")
          : "Please follow the instructions below to verify your domain ownership."}
      </Success>,
    );

    return { ingress };
  }

  protected render({ ingress }: CreateResult): ReactNode {
    if (this.flags.quiet) {
      this.log(ingress.id);
    }

    const output: ReactNode[] = [];

    if (ingress.dnsValidationErrors.length > 0) {
      output.push(
        <Box key="dns" marginLeft={2}>
          <DnsValidationErrors ingress={ingress} />
        </Box>,
      );
    }

    return output;
  }
}
