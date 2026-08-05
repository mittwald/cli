import { Args, Flags } from "@oclif/core";
import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Success } from "../../../rendering/react/components/Success.js";
import { Value } from "../../../rendering/react/components/Value.js";
import { stackFlags } from "../../../lib/resources/stack/flags.js";
import { assertStatus } from "@mittwald/api-client";
import assertSuccess from "../../../lib/apiutil/assert_success.js";
import { parseEnvironmentVariablesFromArray } from "../../../lib/util/parser.js";
import { collectTemplateUserInputs } from "../../../lib/resources/stack/template-inputs.js";

type Result = {
  stackId: string;
  templateId: string;
};

export default class Install extends ExecRenderBaseCommand<
  typeof Install,
  Result
> {
  static summary = "Install a template into an existing container stack";
  static description = `\
Adds the services and volumes of a container template to a stack that already exists, instead of creating a new stack for it.

This is intended for templates of type "component"; use "<%= config.bin %> stack create --from-template" to create a new stack from a standalone template.

Template user inputs can be supplied non-interactively with one or more --input flags in 'name=value' format; any required inputs that are neither provided nor have a default value are prompted for interactively.`;

  static examples = [
    {
      description: "Install a template into the stack from the current context",
      command: "<%= config.bin %> <%= command.id %> <template-id>",
    },
    {
      description: "Install a template into a specific stack, with inputs",
      command:
        "<%= config.bin %> <%= command.id %> <template-id> --stack-id <stack-id> --input DB_NAME=mydb",
    },
  ];

  static args = {
    "template-id": Args.string({
      description: "ID of the container template to install",
      required: true,
    }),
  };

  static flags = {
    ...stackFlags,
    ...processFlags,
    input: Flags.string({
      summary: "user input for the template, in 'name=value' format",
      description:
        "May be repeated to provide multiple inputs. Required inputs that are not provided (and have no default) are prompted for interactively.",
      multiple: true,
    }),
  };

  protected async exec(): Promise<Result> {
    const process = makeProcessRenderer(
      this.flags,
      "Installing template into container stack",
    );
    const stackId = await this.withStackId(Install);
    const templateId = this.args["template-id"];

    const template = await process.runStep(
      "retrieving container template",
      async () => {
        const r = await this.apiClient.container.getTemplate({ templateId });
        assertStatus(r, 200);
        return r.data;
      },
    );

    if (template.type !== "component") {
      process.addInfo(
        `template '${templateId}' is of type '${template.type}'; installing it into an existing stack may not be supported. Consider "${this.config.bin} stack create --from-template" instead.`,
      );
    }

    const providedInputs = parseEnvironmentVariablesFromArray(this.flags.input);
    const userInputs = await collectTemplateUserInputs(
      template.userInputs ?? [],
      providedInputs,
      process,
    );

    await process.runStep("installing template into stack", async () => {
      const r = await this.apiClient.container.addTemplateComponent({
        stackId,
        data: {
          templateConfig: {
            templateId,
            userInputs,
          },
        },
      });
      assertSuccess(r);
    });

    await process.complete(
      <Success>
        The template <Value>{template.name.en}</Value> was successfully
        installed into stack <Value>{stackId}</Value>.
      </Success>,
    );

    return { stackId, templateId };
  }

  protected render({ stackId }: Result): ReactNode {
    if (this.flags.quiet) {
      return stackId;
    }
  }
}
