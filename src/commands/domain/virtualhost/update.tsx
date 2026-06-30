import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { Args, Flags, ux } from "@oclif/core";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Success } from "../../../rendering/react/components/Success.js";
import { Value } from "../../../rendering/react/components/Value.js";

type IngressPath = MittwaldAPIV2.Components.Schemas.IngressPath;
type IngressIngress = MittwaldAPIV2.Components.Schemas.IngressIngress;

type UpdateResult = {
  ingress: IngressIngress;
};

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description =
    "Update the paths of an existing virtual host. The given paths replace the existing ones entirely, so you need to specify all paths that the virtual host should have after the update.";
  static examples = [
    {
      description: "Point the root path of a virtual host to an app",
      command:
        "<%= config.bin %> <%= command.id %> 3ecaf1a9-6eb4-4869-b811-8a13c3a2e745 --path-to-app /:fdc7e3a8-9b1c-4d2e-8f5a-6c7b8d9e0f1a",
    },
    {
      description: "Point the root path of a virtual host to a URL",
      command:
        "<%= config.bin %> <%= command.id %> 3ecaf1a9-6eb4-4869-b811-8a13c3a2e745 --path-to-url /:https://redirect.example",
    },
  ];
  static args = {
    "virtual-host-id": Args.string({
      description: "ID of the virtual host to update",
      required: true,
    }),
  };
  static flags = {
    ...processFlags,
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
    "path-to-container": Flags.string({
      summary: "add a path mapping to a container",
      multiple: true,
      description:
        "This flag can be used to map a specific URL path to a container; the value for this flag should be the URL path, the container ID and the target port, each separated by a colon, e.g. /:3ecaf1a9-6eb4-4869-b811-8a13c3a2e745:80/tcp. You can specify this flag multiple times to map multiple paths to different containers, and also combine it with the other --path-to-* flags.",
    }),
  };

  protected async exec(): Promise<UpdateResult> {
    const ingressId = this.args["virtual-host-id"];
    const process = makeProcessRenderer(
      this.flags,
      "Updating the paths of a virtual host",
    );
    const paths: IngressPath[] = [];

    for (const pathToApp of this.flags["path-to-app"] ?? []) {
      const [path, installationId] = pathToApp.split(":");
      paths.push({ path, target: { installationId } });
    }

    for (const pathToUrl of this.flags["path-to-url"] ?? []) {
      const [path, ...urlParts] = pathToUrl.split(":");
      const url = urlParts.join(":");
      paths.push({ path, target: { url } });
    }

    for (const pathToContainer of this.flags["path-to-container"] ?? []) {
      const [path, container, portProtocol] = pathToContainer.split(":", 3);
      paths.push({
        path,
        target: { container: { id: container, portProtocol } },
      });
    }

    if (paths.length === 0) {
      process.error(
        "You need to specify at least one path mapping using one of the --path-to-* flags.",
      );
      ux.exit(1);
    }

    await process.runStep("updating ingress paths", async () => {
      const response = await this.apiClient.domain.ingressUpdateIngressPaths({
        ingressId,
        data: paths,
      });

      assertStatus(response, 204);
    });

    const ingress = await process.runStep(
      "fetching updated virtual host",
      async (): Promise<IngressIngress> => {
        const response = await this.apiClient.domain.ingressGetIngress({
          ingressId,
        });

        assertStatus(response, 200);

        return response.data;
      },
    );

    await process.complete(
      <Success>
        The paths of your virtual host <Value>{ingress.hostname}</Value> were
        successfully updated! 🚀
      </Success>,
    );

    return { ingress };
  }

  protected render({ ingress }: UpdateResult): ReactNode {
    if (this.flags.quiet) {
      this.log(ingress.id);
    }

    return undefined;
  }
}
