import FlagSetBuilder from "../../context/FlagSetBuilder.js";
import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Config, Flags } from "@oclif/core";
import Context from "../../context/Context.js";

/**
 * Stack selection for commands that operate on a project's default stack unless
 * told otherwise. Resolve these with `withStackIdOrDefault`.
 */
export const optionalStackFlags = {
  "stack-id": Flags.string({
    char: "s",
    summary: "ID of the stack to operate on",
    description:
      "If omitted, the stack set in the CLI context is used; when that is not set either, the project's default stack is used.",
  }),
};

export const {
  flags: stackFlags,
  args: stackArgs,
  withId: withStackId,
} = new FlagSetBuilder("stack", "s", {
  retrieveFunction: async (client, context) => {
    const projectContext = await context.projectId();
    if (!projectContext) {
      return null;
    }

    const projectId = projectContext.value;
    const stacks = await client.container.listStacks({ projectId });

    assertStatus(stacks, 200);
    if (stacks.data.length === 1) {
      return stacks.data[0].id;
    }

    return null;
  },
}).build();

/**
 * Resolves the stack that a project-scoped command should operate on.
 *
 * Unlike `withStackId`, this does not fail when no stack can be determined; it
 * falls back to the project's default stack (whose ID is identical to the
 * project ID). This keeps commands that used to be hard-wired to the default
 * stack working as before, while allowing any other stack to be addressed
 * explicitly.
 */
export async function withStackIdOrDefault(
  apiClient: MittwaldAPIV2Client,
  flags: { [k: string]: unknown },
  projectId: string,
  cfg: Config,
): Promise<string> {
  const fromFlags = flags["stack-id"];
  if (typeof fromFlags === "string") {
    return fromFlags;
  }

  const fromContext = await new Context(apiClient, cfg).stackId();
  if (fromContext) {
    return fromContext.value;
  }

  return projectId;
}
