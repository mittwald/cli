import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import React, { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import * as cp from "child_process";
import { Box, Text } from "ink";
import { Value } from "../../rendering/react/components/Value.js";
import { Args } from "@oclif/core";
import { sshConnectionFlags } from "../../lib/resources/ssh/flags.js";
import { sshUsageDocumentation } from "../../lib/resources/ssh/doc.js";
import { buildSSHClientFlags } from "../../lib/resources/ssh/connection.js";
import { withContainerAndStackId } from "../../lib/resources/container/flags.js";
import { getSSHConnectionForContainer } from "../../lib/resources/ssh/container.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import PortMapping from "../../lib/units/PortMapping.js";
import { assertStatus } from "@mittwald/api-client";

export class PortForward extends ExecRenderBaseCommand<
  typeof PortForward,
  Record<string, never>
> {
  static summary = "Forward a container port to a local port";
  static description =
    "This command forwards a TCP port from a container to a local port on your machine. This allows you to connect to services running in the container as if they were running on your local machine.\n\n" +
    sshUsageDocumentation;
  static flags = {
    ...processFlags,
    ...sshConnectionFlags,
    ...projectFlags,
  };
  static args = {
    "container-id": Args.string({
      description: "ID or short ID of the container to connect to",
      required: true,
    }),
    port: PortMapping.arg({
      summary:
        "Port mapping in the format 'local-port:container-port' or 'port'",
      description:
        "Specifies the port mapping between your local machine and the container. Format: 'local-port:container-port' or just 'port' (in which case the same port is used locally and in the container). If not specified, available ports will be detected automatically.",
      required: false,
    }),
  };

  protected async exec(): Promise<Record<string, never>> {
    const [serviceId, stackId] = await withContainerAndStackId(
      this.apiClient,
      PortForward,
      this.flags,
      this.args,
      this.config,
    );

    const p = makeProcessRenderer(this.flags, "Port-forwarding a container");

    const { host, user } = await getSSHConnectionForContainer(
      this.apiClient,
      serviceId,
      stackId,
      this.flags["ssh-user"],
    );

    const portMappings = await this.getPortMappings(stackId, serviceId);

    await p.complete(
      <Box flexDirection="column">
        {portMappings.map((p, idx) => (
          <Text key={idx}>
            Forwarding container port <Value>{p.remotePort}</Value> to local
            port <Value>{p.localPort}</Value>.
          </Text>
        ))}
        <Text>Use CTRL+C to cancel.</Text>
      </Box>,
    );

    const sshArgs = buildSSHClientFlags(user, host, this.flags, {
      interactive: false,
      additionalFlags: portMappings
        .map((p) => ["-L", `${p.localPort}:localhost:${p.remotePort}`])
        .flat(),
      configDir: this.config.configDir,
    });

    cp.spawnSync("ssh", [...sshArgs, "sleep", "infinity"], {
      stdio: ["ignore", process.stdout, process.stderr],
    });
    return {};
  }

  private async getPortMappings(stackId: string, serviceId: string) {
    if (this.args.port) {
      return [this.args.port];
    }

    const containerResponse = await this.apiClient.container.getService({
      stackId,
      serviceId,
    });

    assertStatus(containerResponse, 200);

    const ports = containerResponse.data.deployedState.ports ?? [];
    return ports.map((p) => PortMapping.fromPortAndProtocol(p));
  }

  protected render(): ReactNode {
    return undefined;
  }
}
