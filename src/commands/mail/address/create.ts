import { BaseCommand } from "../../../BaseCommand.js";
import { normalizeProjectIdToUuid } from "../../../Helpers.js";
import { Flags, ux } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";

export default class Create extends BaseCommand<typeof Create> {
  static description = "Create a new mail address";
  static flags = {
    projectId: Flags.string({
      char: "p",
      description: "Project ID or short ID",
      required: true,
    }),
    address: Flags.string({
      char: "a",
      description: "Mail address",
      required: true,
    }),
    "catch-all": Flags.boolean({
      description: "Make this a catch-all mail address",
    }),
    "enable-spam-protection": Flags.boolean({
      description: "Enable spam protection for this mailbox",
      default: true,
      allowNo: true,
    }),
    quota: Flags.integer({
      description: "Mailbox quota in mebibytes",
      default: 1024,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Create);

    const projectId = await normalizeProjectIdToUuid(
      this.apiClient,
      flags.projectId,
    );

    const password = await ux.prompt("Mailbox password", { type: "hide" });

    ux.action.start("creating mail address");

    const response = await this.apiClient.mail.mailaddressCreate({
      pathParameters: { projectId },
      data: {
        address: flags.address,
        isCatchAll: flags["catch-all"],
        mailbox: {
          password,
          quotaInBytes: flags.quota * 1024 * 1024,
          enableSpamProtection: flags["enable-spam-protection"],
        },
      },
    });

    assertStatus(response, 201);

    ux.action.stop();

    this.log(response.data.id);
  }
}
