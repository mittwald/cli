import { DeleteBaseCommand } from "../../lib/basecommands/DeleteBaseCommand.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { stackArgs } from "../../lib/resources/stack/flags.js";
import { Flags } from "@oclif/core";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a container stack";
  static resourceName = "container stack";
  static aliases = ["stack:rm"];

  static flags = {
    ...DeleteBaseCommand.baseFlags,
    "with-volumes": Flags.boolean({
      summary: "no longer has any effect",
      description:
        "Volumes are always removed together with the stack. This flag is only kept for backwards compatibility and will be removed in a future release.",
      default: false,
      char: "v",
      deprecated: {
        message:
          "The --with-volumes flag no longer has any effect, as volumes are always removed together with the stack.",
      },
    }),
  };
  static args = { ...stackArgs };

  protected async deleteResource(): Promise<void> {
    const stackId = await this.withStackId(Delete);
    const resp = await this.apiClient.container.deleteStack({ stackId });
    assertSuccess(resp);
  }
}
