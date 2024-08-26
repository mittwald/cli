import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { projectFlags } from "../../../lib/resources/project/flags.js";
import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Text } from "ink";
import { Success } from "../../../rendering/react/components/Success.js";
import { ReactNode } from "react";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import { FlagInput, OutputFlags } from "@oclif/core/lib/interfaces/parser.js";
import crypto from "crypto";
import { Value } from "../../../rendering/react/components/Value.js";

type CreateResult = {
  deliveryboxId: string;
  generatedPassword: string | null;
};

export default class Create extends ExecRenderBaseCommand<
  typeof Create,
  CreateResult
> {
  static summary = "Create a new mail deliverybox";
  static description = `\
    This command can be used to create a new mail deliverybox in a project.
  
    When running this command with the --quiet flag, the output will contain the ID of the newly created deliverybox.
    In addition, when run with --generated-password the output will be the ID of the newly created deliverybox, followed by a tab character and the generated password.`;
  static flags = {
    ...projectFlags,
    ...processFlags,
    description: Flags.string({
      char: "d",
      summary: "mail deliverybox description",
      required: true,
    }),
    password: Flags.string({
      summary: "deliverybox password",
      exclusive: ["random-password"],
      description:
        "This is the password that should be used for the deliverybox; if omitted, the command will prompt interactively for a password.\n\nCAUTION: providing this flag may log your password in your shell history!",
    }),
    "random-password": Flags.boolean({
      summary: "generate a random password",
      exclusive: ["password"],
      description:
        "This flag will cause the command to generate a random 32-character password for the deliverybox; when running with --quiet, the devliverybox ID and the password will be printed to stdout, separated by a tab character.",
    }),
  };

  static examples = [
    {
      description: "Create non-interactively with password",
      command:
        "$ read -s PASSWORD &&\n <%= config.bin %> <%= command.id %> --password $PASSWORD --description 'my personal deliverybox'",
    },
    {
      description: "Create non-interactively with random password",
      command:
        "<%= config.bin %> <%= command.id %> --random-password --description 'my personal deliverybox'",
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

    return [
      await process.addInput(<Text>Deliverybox password</Text>, true),
      false,
    ];
  }

  protected async createMailDeliverybox(
    projectId: string,
    process: ProcessRenderer,
    flags: OutputFlags<FlagInput<typeof Create.flags>>,
  ): Promise<CreateResult> {
    const [password, passwordGenerated] = await this.getPassword(process);

    const response = await process.runStep(
      "creating mail deliverybox",
      async () => {
        const response = await this.apiClient.mail.createDeliverybox({
          projectId,
          data: {
            description: flags.description,
            password,
          },
        });

        assertStatus(response, 201);
        return response;
      },
    );

    await process.complete(
      <Success>Your mail deliverybox was successfully created.</Success>,
    );

    return {
      deliveryboxId: response.data.id,
      generatedPassword: passwordGenerated ? password : null,
    };
  }

  protected async exec(): Promise<CreateResult> {
    const { flags } = await this.parse(Create);
    const projectId = await this.withProjectId(Create);

    const process = makeProcessRenderer(
      flags,
      "Creating a new mail deliverybox",
    );

    return this.createMailDeliverybox(projectId, process, flags);
  }

  protected render(executionResult: CreateResult): ReactNode {
    if (this.flags.quiet) {
      if (executionResult.generatedPassword) {
        return (
          <Text>
            {executionResult.deliveryboxId}
            {"\t"}
            {executionResult.generatedPassword}
          </Text>
        );
      }
      return <Text>{executionResult.deliveryboxId}</Text>;
    }
  }
}
