import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";
import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/react/process_flags.js";
import { Text } from "ink";
import { Success } from "../../../rendering/react/components/Success.js";
import { ReactNode } from "react";

export default class Create extends ExecRenderBaseCommand<
  typeof Create,
  { addressId: string }
> {
  static description = "Create a new mail address";
  static flags = {
    ...projectFlags,
    ...processFlags,
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

  protected async exec(): Promise<{ addressId: string }> {
    const { flags } = await this.parse(Create);
    const projectId = await withProjectId(
      this.apiClient,
      flags,
      {},
      this.config,
    );

    const process = makeProcessRenderer(flags, "Creating a new mail address");
    const password = await process.addInput(
      <Text>Mailbox password</Text>,
      true,
    );

    const response = await process.runStep(
      "creating mail address",
      async () => {
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
        return response;
      },
    );

    process.complete(<Success>Your mail address was successfully created.</Success>)

    return { addressId: response.data.id };
  }

  protected render(executionResult: { addressId: string }): ReactNode {
    if (this.flags.quiet) {
      return executionResult.addressId;
    }
  }
}
