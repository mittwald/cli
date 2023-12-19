import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { projectFlags } from "../../../lib/project/flags.js";
import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Text } from "ink";
import { Success } from "../../../rendering/react/components/Success.js";
import { ReactNode } from "react";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import * as crypto from "crypto";
import { Value } from "../../../rendering/react/components/Value.js";

type CreateResult = {
  addressId: string;
  generatedPassword: string | null;
};

export default class Create extends ExecRenderBaseCommand<
  typeof Create,
  CreateResult
> {
  static summary = "Create a new mail address";
  static description = `\
    When running this command with the --quiet flag, the output will contain the ID of the newly created address.
    In addition, when run with --generated-password the output will be the ID of the newly created address, followed by a tab character and the generated password.`;
  static flags = {
    ...projectFlags,
    ...processFlags,
    address: Flags.string({
      char: "a",
      summary: "mail address",
      required: true,
    }),
    "catch-all": Flags.boolean({
      description: "make this a catch-all mail address",
    }),
    "enable-spam-protection": Flags.boolean({
      description: "enable spam protection for this mailbox",
      default: true,
      allowNo: true,
    }),
    quota: Flags.integer({
      description: "mailbox quota in mebibytes",
      default: 1024,
    }),
    password: Flags.string({
      summary: "mailbox password",
      description:
        "This is the password that should be used for the mailbox; if omitted, the command will prompt interactively for a password.\n\nCAUTION: providing this flag may log your password in your shell history!",
    }),
    "random-password": Flags.boolean({
      summary: "generate a random password",
      description:
        "This flag will cause the command to generate a random 32-character password for the mailbox; when running with --quiet, the address ID and the password will be printed to stdout, separated by a tab character.",
    }),
  };

  static examples = [
    {
      description: "Create non-interactively with password",
      command:
        "$ read -s PASSWORD &&\n <%= config.bin %> <%= command.id %> --password $PASSWORD --address foo@bar.example",
    },
    {
      description: "Create non-interactively with random password",
      command:
        "<%= config.bin %> <%= command.id %> --random-password --address foo@bar.example",
    },
  ];

  protected async getPassword(
    process: ProcessRenderer,
  ): Promise<[string, boolean]> {
    if (this.flags.password) {
      return [this.flags.password, false];
    }

    if (this.flags["random-password"]) {
      const generated = await process.runStep(
        "generating random password",
        async () => {
          return crypto.randomBytes(32).toString("base64").substring(0, 32);
        },
      );

      process.addInfo(
        <Text>
          generated password: <Value>{generated}</Value>
        </Text>,
      );
      return [generated, true];
    }

    return [await process.addInput(<Text>Mailbox password</Text>, true), false];
  }

  protected async exec(): Promise<CreateResult> {
    const { flags } = await this.parse(Create);
    const projectId = await this.withProjectId(Create);

    const process = makeProcessRenderer(flags, "Creating a new mail address");
    const [password, passwordGenerated] = await this.getPassword(process);

    const response = await process.runStep(
      "creating mail address",
      async () => {
        const response = await this.apiClient.mail.createMailAddress({
          projectId,
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

    process.complete(
      <Success>Your mail address was successfully created.</Success>,
    );

    return {
      addressId: response.data.id,
      generatedPassword: passwordGenerated ? password : null,
    };
  }

  protected render(executionResult: CreateResult): ReactNode {
    if (this.flags.quiet) {
      if (executionResult.generatedPassword) {
        return (
          <Text>
            {executionResult.addressId}
            {"\t"}
            {executionResult.generatedPassword}
          </Text>
        );
      }
      return <Text>{executionResult.addressId}</Text>;
    }
  }
}
