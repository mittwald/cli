import { Args } from "@oclif/core";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { withContainerAndStackId } from "../../lib/resources/container/flags.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { DeleteBaseCommand } from "../../lib/basecommands/DeleteBaseCommand.js";
import { assertStatus } from "@mittwald/api-client";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a container";
  static resourceName = "container";
  static aliases = ["container:rm"];

  static flags = {
    ...DeleteBaseCommand.baseFlags,
    ...projectFlags,
  };
  static args = {
    "container-id": Args.string({
      description: "ID or short ID of the container to start",
      required: true,
    }),
  };

  protected async deleteResource(): Promise<void> {
    const [serviceId, stackId] = await withContainerAndStackId(
      this.apiClient,
      Delete,
      this.flags,
      this.args,
      this.config,
    );

    const stackResponse = await this.apiClient.container.getStack({ stackId });
    assertStatus(stackResponse, 200);

    const service = stackResponse.data.services?.find(
      (s) => s.id === serviceId,
    );
    if (!service) {
      return;
    }

    const response = await this.apiClient.container.updateStack({
      stackId,
      data: {
        services: {
          [service.serviceName]: {},
        },
      },
    });

    assertSuccess(response);
  }
}
