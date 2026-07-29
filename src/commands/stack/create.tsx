import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { Flags } from "@oclif/core";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import Context from "../../lib/context/Context.js";
import { parseEnvironmentVariablesFromArray } from "../../lib/util/parser.js";
import { collectTemplateUserInputs } from "../../lib/resources/stack/template-inputs.js";

type ContainerCreateStack =
  MittwaldAPIV2.Components.Schemas.ContainerCreateStack;

type Result = {
  stackId: string;
};

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static summary = "Create a new container stack";
  static description = `\
Creates a new, empty container stack, or a stack based on a container template.

When --from-template is given, the referenced template may define user inputs. These can be supplied non-interactively with one or more --input flags in 'name=value' format; any required inputs that are neither provided nor have a default value are prompted for interactively.

Use "<%= config.bin %> stack template list" to discover available templates and their IDs. To add a template to a stack that already exists, use "<%= config.bin %> stack template install" instead.`;

  static examples = [
    {
      description: "Create an empty stack",
      command: '<%= config.bin %> <%= command.id %> --description "my stack"',
    },
    {
      description: "Create a stack from a template, providing user inputs",
      command:
        '<%= config.bin %> <%= command.id %> --description "my n8n" --from-template <template-id> --input DOMAIN=example.com --input ADMIN_EMAIL=admin@example.com',
    },
  ];

  static flags = {
    ...projectFlags,
    ...processFlags,
    description: Flags.string({
      char: "d",
      summary: "description of the stack",
      required: true,
    }),
    "from-template": Flags.string({
      summary: "ID of a container template to create the stack from",
      description:
        "When set, the stack is created from the given container template. Omit this flag to create an empty stack.",
    }),
    input: Flags.string({
      summary: "user input for a template, in 'name=value' format",
      description:
        "May be repeated to provide multiple inputs. Only applicable together with --from-template. Required inputs that are not provided (and have no default) are prompted for interactively.",
      multiple: true,
      dependsOn: ["from-template"],
    }),
    "update-context": Flags.boolean({
      char: "c",
      summary: "update the CLI context to use the newly created stack",
    }),
  };

  protected async exec(): Promise<Result> {
    const process = makeProcessRenderer(
      this.flags,
      "Creating a new container stack",
    );
    const projectId = await this.withProjectId(Create);
    const { description, "from-template": fromTemplate } = this.flags;

    const data: ContainerCreateStack = { description };

    if (fromTemplate) {
      const template = await process.runStep(
        "retrieving container template",
        async () => {
          const r = await this.apiClient.container.getTemplate({
            templateId: fromTemplate,
          });
          assertStatus(r, 200);
          return r.data;
        },
      );

      const providedInputs = parseEnvironmentVariablesFromArray(
        this.flags.input,
      );
      const userInputs = await collectTemplateUserInputs(
        template.userInputs ?? [],
        providedInputs,
        process,
      );

      data.templateConfig = {
        templateId: fromTemplate,
        userInputs,
      };
    }

    const { id: stackId } = await process.runStep(
      "creating container stack",
      async () => {
        const r = await this.apiClient.container.createStack({
          projectId,
          data,
        });
        assertStatus(r, 201);
        return r.data;
      },
    );

    if (this.flags["update-context"]) {
      await process.runStep("updating CLI context", async () => {
        await new Context(this.apiClient, this.config).setStackId(stackId);
      });
    }

    await process.complete(
      <Success>
        The container stack <Value>{stackId}</Value> was successfully created.
      </Success>,
    );

    return { stackId };
  }

  protected render({ stackId }: Result): ReactNode {
    if (this.flags.quiet) {
      return stackId;
    }
  }
}
