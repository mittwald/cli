import { BaseCommand } from "../../lib/basecommands/BaseCommand.js";
import { GetBaseCommand } from "../../lib/basecommands/GetBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import { stackFlags, withStackId } from "../../lib/resources/stack/flags.js";
import { withContainerId } from "../../lib/resources/container/flags.js";
import {
  projectFlags,
  withProjectId,
} from "../../lib/resources/project/flags.js";
import { assertStatus } from "@mittwald/api-client";
import { printToPager } from "../../lib/util/pager.js";

export class Logs extends BaseCommand {
  static summary = "Display logs of a specific container.";
  static description =
    "This command prints the log output of a specific container. " +
    "" +
    'When this command is run in a terminal, the output is piped through a pager. The pager is determined by your PAGER environment variable, with defaulting to "less". You can disable this behavior with the --no-pager flag.';

  static aliases = ["container:ls"];
  static flags = {
    ...GetBaseCommand.baseFlags,
    ...projectFlags,
    "no-pager": Flags.boolean({
      description: "Disable pager for output.",
    }),
  };
  static args = {
    "container-id": Args.string({
      description: "ID of the container for which to get logs",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags, args } = await this.parse(Logs);

    const projectId = await withProjectId(
      this.apiClient,
      Logs,
      flags,
      args,
      this.config,
    );

    const [serviceId, stackId] = await this.getContainerAndStack(
      projectId,
      args["container-id"],
    );
    const usePager = process.stdin.isTTY && !flags["no-pager"];

    const logsResp = await this.apiClient.container.getServiceLogs({
      stackId,
      serviceId,
    });
    assertStatus(logsResp, 200);

    // This is to work around a bug which causes the response to
    // "getServiceLogs" to contain extra NULL bytes.
    // eslint-disable-next-line no-control-regex
    const logs = logsResp.data.replace(/^\x00*/, "");

    if (usePager) {
      printToPager(logs);
    } else {
      this.log(logs);
    }
  }

  private async getContainerAndStack(
    projectId: string,
    containerId: string,
  ): Promise<[string, string]> {
    const containerResp = await this.apiClient.container.listServices({
      projectId,
    });

    assertStatus(containerResp, 200);

    for (const container of containerResp.data) {
      if (container.shortId === containerId || container.id === containerId) {
        return [container.id, container.stackId];
      }
    }

    throw new Error(
      `no container ${containerId} found in project ${projectId}`,
    );
  }
}
