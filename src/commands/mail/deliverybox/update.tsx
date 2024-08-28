import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Text } from "ink";
import { Success } from "../../../rendering/react/components/Success.js";
import { ReactNode } from "react";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import crypto from "crypto";
import {
  mailDeliveryBoxArgs,
  withDeliveryBoxId,
} from "../../../lib/resources/mail/flags.js";
import { generateRandomPassword } from "../commons.js";

type UpdateResult = {
  generatedPassword: string | null;
};

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static summary = "Update a mail delivery box";
  static description = `\
    This command can be used to update a mail delivery box in a project.
    
    A mail delivery box is either associated with a mailbox, or forwards to another address.
  
    When running this command with --generated-password the output will be the newly generated and set password.`;
  static args = { ...mailDeliveryBoxArgs };
  static flags = {
    ...processFlags,
    description: Flags.string({
      summary: "delivery box description",
      description:
        "If set, the delivery description will be updated to this password. If omitted, the description will remain unchanged.",
    }),
    password: Flags.string({
      summary: "delivery box password",
      description:
        "If set, the delivery box will be updated to this password. If omitted, the password will remain unchanged.\n\nCAUTION: providing this flag may log your password in your shell history!",
    }),
    "random-password": Flags.boolean({
      summary: "generate a random password",
      description:
        "This flag will cause the command to generate a random 32-character password for the delivery box; when running with --quiet, the password will be printed to stdout.",
    }),
  };

  static examples = [
    {
      description: "Update non-interactively with password",
      command:
        "$ read -s PASSWORD &&\n <%= config.bin %> <%= command.id %> --password $PASSWORD --description 'my personal delivery box'",
    },
    {
      description: "Update non-interactively with random password",
      command:
        "<%= config.bin %> <%= command.id %> --random-password --description 'my personal delivery box'",
    },
  ];

  protected async setDescription(
    deliveryBoxId: string,
    description: string,
    process: ProcessRenderer,
  ): Promise<void> {
    await process.runStep(
      "set the description of a mail delivery box",
      async () => {
        const response = await this.apiClient.mail.updateDeliveryBoxDescription(
          {
            deliveryBoxId: deliveryBoxId,
            data: {
              description: description,
            },
          },
        );

        assertStatus(response, 204);
      },
    );
  }

  protected async setPassword(
    deliveryBoxId: string,
    password: string,
    process: ProcessRenderer,
  ): Promise<void> {
    await process.runStep(
      "set the password of a mail delivery box",
      async () => {
        const response = await this.apiClient.mail.updateDeliveryBoxPassword({
          deliveryBoxId,
          data: {
            password,
          },
        });

        assertStatus(response, 204);
      },
    );
  }

  protected async exec(): Promise<UpdateResult> {
    const process = makeProcessRenderer(
      this.flags,
      "Updating a mail delivery box",
    );
    const deliveryBoxId = await withDeliveryBoxId(
      this.apiClient,
      Update,
      this.flags,
      this.args,
      this.config,
    );

    if (this.flags.description) {
      await this.setDescription(deliveryBoxId, this.flags.description, process);
    }

    let password = null;

    if (this.flags.password) {
      await this.setPassword(deliveryBoxId, this.flags.password, process);
    } else if (this.flags["random-password"]) {
      password = await generateRandomPassword(process);

      await this.setPassword(deliveryBoxId, password, process);
    }

    await process.complete(
      <Success>The mail delivery box was successfully updated.</Success>,
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
