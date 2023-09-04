import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";
import { ReactNode } from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { Flags } from "@oclif/core";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Success } from "../../../rendering/react/components/Success.js";
import { Value } from "../../../rendering/react/components/Value.js";
import { waitUntil } from "../../../lib/wait.js";
import { Box } from "ink";
import { DnsValidationErrors } from "../../../rendering/react/components/Ingress/DnsValidationErrors.js";
import IngressPath = MittwaldAPIV2.Components.Schemas.IngressPath;
import IngressIngress = MittwaldAPIV2.Components.Schemas.IngressIngress;
import DomainDomainOwnership = MittwaldAPIV2.Components.Schemas.DomainDomainOwnership;
import { DomainOwnership } from "../../../rendering/react/components/Ingress/DomainOwnership.js";

type CreateResult = {
  ingress: IngressIngress;
  ownership: DomainDomainOwnership | null;
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
    "path-to-dir": Flags.string({
      summary: "add a path mapping to a directory",
      multiple: true,
      description:
        "This flag can be used to map a specific URL path to a directory in your project's file system; the value for this flag should be the URL path and the filesystem path, separated by a colon, e.g. /:/ or /:/some/sub/path. You can specify this flag multiple times to map multiple paths to different directories, and also combine it with the other --path-to-* flags.",
    }),
    "path-to-app": Flags.string({
      summary: "add a path mapping to an app",
      description:
        "This flag can be used to map a specific URL path to an app; the value for this flag should be the URL path and the app ID, separated by a colon, e.g. /:3ecaf1a9-6eb4-4869-b811-8a13c3a2e745. You can specify this flag multiple times to map multiple paths to different apps, and also combine it with the other --path-to-* flags.",
      multiple: true,
    }),
    "path-to-url": Flags.string({
      summary: "add a path mapping to an external url",
      multiple: true,
      description:
        "This flag can be used to map a specific URL path to an external URL; the value for this flag should be the URL path and the external URL, separated by a colon, e.g. /:https://redirect.example. You can specify this flag multiple times to map multiple paths to different external URLs, and also combine it with the other --path-to-* flags.",
    }),
  };

  protected async exec(): Promise<CreateResult> {
    const projectId = await withProjectId(
      this.apiClient,
      Create,
      this.flags,
      this.args,
      this.config,
    );
    const process = makeProcessRenderer(this.flags, "Creating a new ingress");
    const { hostname } = this.flags;
    const paths: IngressPath[] = [];

    for (const pathToDir of this.flags["path-to-dir"] ?? []) {
      const [path, directory] = pathToDir.split(":");
      paths.push({ path, target: { directory } });
    }

    for (const pathToApp of this.flags["path-to-app"] ?? []) {
      const [path, installationId] = pathToApp.split(":");
      paths.push({ path, target: { installationId } });
    }

    for (const pathToUrl of this.flags["path-to-url"] ?? []) {
      const [path, url] = pathToUrl.split(":");
      paths.push({ path, target: { url } });
    }

    const { id: ingressId } = await process.runStep(
      "creating ingress",
      async () => {
        const response = await this.apiClient.domain.ingressCreate({
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

    const [ingress, ownership] = await process.runStep(
      "waiting for ingress to be ready",
      async (): Promise<[IngressIngress, DomainDomainOwnership | null]> => {
        return await waitUntil(async () => {
          const response = await this.apiClient.domain.ingressGetSpecific({
            ingressId,
          });

          if (response.status !== 200) {
            return null;
          }

          const ownershipResponse =
            await this.apiClient.domain.listDomainOwnerships({
              projectId,
            });
          if (ownershipResponse.status === 200) {
            const ownership = ownershipResponse.data.find(
              (o) => o.domain === hostname,
            );
            if (ownership) {
              return [response.data, ownership];
            }
          }

          if (response.data.ips.v4.length === 0) {
            return null;
          }

          return [response.data, null];
        });
      },
    );

    process.complete(
      <Success>
        You virtual host for <Value>{hostname}</Value> was successfully created!
        🚀{" "}
        {ingress.ips.v4.length > 0
          ? "Please point your DNS records to the following IP addresses: " +
            ingress.ips.v4.join(", ")
          : "Please follow the instructions below to verify your domain ownership."}
      </Success>,
    );

    return { ingress, ownership };
  }

  protected render({ ingress, ownership }: CreateResult): ReactNode {
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

    if (ownership) {
      output.push(
        <Box key="ownership" marginLeft={2}>
          <DomainOwnership ownership={ownership} />
        </Box>,
      );
    }

    return output;
  }
}
