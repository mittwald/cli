import FlagSetBuilder from "../../context/FlagSetBuilder.js";
import { assertStatus } from "@mittwald/api-client";

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
