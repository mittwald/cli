import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Text } from "ink";
import { Success } from "../../../rendering/react/components/Success.js";
import { ReactNode } from "react";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import {
  mailAddressArgs,
  sharedMailAddressFlags,
  withMailAddressId,
} from "../../../lib/mail/flags.js";
import crypto from "crypto";

type UpdateResult = {
  generatedPassword: string | null;
};

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static summary = "Update a mail address";
  static description = `\
    This command can be used to update a mail address in a project.
    
    A mail address is either associated with a mailbox, or forwards to another address.
    
    To set forwarding addresses, use the --forward-to flag.
    
    Use the --catch-all flag to make the mailbox a catch-all mailbox.
  
    When running this command with --generated-password the output will be the newly generated and set password.`;
  static args = { ...mailAddressArgs };
  static flags = {
    ...processFlags,
    ...sharedMailAddressFlags,
    quota: Flags.integer({
      description: "mailbox quota in mebibytes",
    }),
    password: Flags.string({
      summary: "mailbox password",
      description:
        "If set, the mailbox will be updated to this password. If omitted, the password will remain unchanged.\n\nCAUTION: providing this flag may log your password in your shell history!",
    }),
    "random-password": Flags.boolean({
      summary: "generate a random password",
      description:
        "This flag will cause the command to generate a random 32-character password for the mailbox; when running with --quiet, the password will be printed to stdout.",
    }),
    "forward-to": Flags.string({
      summary: "forward mail to another address",
      multiple: true,
      description:
        "This flag will cause the mailbox to forward all incoming mail to the given address.\n\nNote: This flag is exclusive with --catch-all, --quota, --password and --random-password.",
      relationships: [
        {
          type: "none",
          flags: ["catch-all", "quota", "password", "random-password"],
        },
      ],
    }),
  };

  static examples = [
    {
      description: "Update non-interactively with password",
      command:
        "$ read -s PASSWORD &&\n <%= config.bin %> <%= command.id %> --password $PASSWORD --address foo@bar.example",
    },
    {
      description: "Update non-interactively with random password",
      command:
        "<%= config.bin %> <%= command.id %> --random-password --address foo@bar.example",
    },
    {
      description: "Update forwarding address",
      command:
        "<%= config.bin %> <%= command.id %> --address foo@bar.example --forward-to bar@bar.example --forward-to baz@bar.example",
    },
  ];

  protected async setAddress(
    mailAddressId: string,
    address: string,
    process: ProcessRenderer,
  ): Promise<void> {
    await process.runStep("set the address of a mail address", async () => {
      const response = await this.apiClient.mail.updateMailAddressAddress({
        mailAddressId: mailAddressId,
        data: {
          address: address,
        },
      });

      assertStatus(response, 204);
    });
  }

  protected async setCatchAll(
    mailAddressId: string,
    catchAll: boolean,
    process: ProcessRenderer,
  ): Promise<void> {
    await process.runStep("set the catchall of a mail address", async () => {
      const response = await this.apiClient.mail.updateMailAddressCatchAll({
        mailAddressId: mailAddressId,
        data: {
          active: catchAll,
        },
      });

      assertStatus(response, 204);
    });
  }

  protected async setForwardAddresses(
    mailAddressId: string,
    forwardAddresses: string[],
    process: ProcessRenderer,
  ): Promise<void> {
    await process.runStep(
      "set the forward addresses of a mail address",
      async () => {
        const response =
          await this.apiClient.mail.updateMailAddressForwardAddresses({
            mailAddressId: mailAddressId,
            data: {
              forwardAddresses: forwardAddresses,
            },
          });

        assertStatus(response, 204);
      },
    );

    return;
  }

  protected async setPassword(
    mailAddressId: string,
    password: string,
    process: ProcessRenderer,
  ): Promise<void> {
    await process.runStep("set the password of a mail address", async () => {
      const response = await this.apiClient.mail.updateMailAddressPassword({
        mailAddressId: mailAddressId,
        data: {
          password: password,
        },
      });

      assertStatus(response, 204);
    });
  }

  protected async setQuota(
    mailAddressId: string,
    quotaInMebiBytes: number,
    process: ProcessRenderer,
  ): Promise<void> {
    await process.runStep("set the quota of a mail address", async () => {
      const response = await this.apiClient.mail.updateMailAddressQuota({
        mailAddressId: mailAddressId,
        data: {
          quotaInBytes: quotaInMebiBytes * 1024 * 1024,
        },
      });

      assertStatus(response, 204);
    });
  }

  protected async exec(): Promise<UpdateResult> {
    const process = makeProcessRenderer(this.flags, "Updating a mail address");
    const mailAddressId = await withMailAddressId(
      this.apiClient,
      Update,
      this.flags,
      this.args,
      this.config,
    );

    if (this.flags.address) {
      this.setAddress(mailAddressId, this.flags.address, process);
    }

    this.setCatchAll(mailAddressId, this.flags["catch-all"], process);

    if (this.flags["forward-to"]) {
      this.setForwardAddresses(
        mailAddressId,
        this.flags["forward-to"],
        process,
      );
    }

    let password = null;

    if (this.flags.password) {
      this.setPassword(mailAddressId, this.flags.password, process);
    } else if (this.flags["random-password"]) {
      password = await process.runStep(
        "generating random password",
        async () => {
          return crypto.randomBytes(32).toString("base64").substring(0, 32);
        },
      );

      this.setPassword(mailAddressId, password, process);
    }

    if (this.flags.quota) {
      this.setQuota(mailAddressId, this.flags.quota, process);
    }

    await process.complete(
      <Success>The mail address was successfully updated.</Success>,
    );

    return Promise.resolve({ generatedPassword: password });
  }

  protected render(executionResult: UpdateResult): ReactNode {
    if (this.flags.quiet) {
      if (executionResult.generatedPassword) {
        return <Text>{executionResult.generatedPassword}</Text>;
      }
      return;
    }
  }
}
