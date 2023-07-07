import { Flags, ux } from "@oclif/core";
import { BaseCommand } from "../../BaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { notify } from "../../lib/notify.js";

export default class Create extends BaseCommand<typeof Create> {
  static description = "Get the details of a project";

  static flags = {
    "server-id": Flags.string({
      char: "s",
      required: true,
      description: "ID of the Server, in which the project is to be created.",
    }),
    description: Flags.string({
      char: "d",
      required: true,
      description: "A description for the project.",
    }),
    wait: Flags.boolean({
      char: "w",
      description: "Wait for the project to be ready.",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Create);
    const { description, "server-id": serverId } = flags;

    ux.action.start("creating project");

    const result = await this.apiClient.project.createProject({
      pathParameters: { serverId },
      data: {
        description,
      },
    });

    assertStatus(result, 201);

    const eventId = result.headers["etag"];

    ux.action.stop("created");
    this.log(result.data.id);

    if (flags.wait) {
      ux.action.start("waiting for project to be ready");
      let waited = 0;
      while (waited < 120) {
        const projectResponse = await this.apiClient.project.getProject({
          pathParameters: { id: result.data.id },
          headers: { "if-event-reached": eventId },
        });

        assertStatus(projectResponse, 200);

        if (projectResponse.data.readiness === "ready") {
          notify({
            title: "Project is ready",
            message: `The project "${description}" is ready`,
          });
          ux.action.stop("ready");
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        waited++;
      }
    }
  }
}
