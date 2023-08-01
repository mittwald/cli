import { Flags } from "@oclif/core";

export const waitFlags = {
  wait: Flags.boolean({
    char: "w",
    description: "Wait for the resource to be ready.",
  }),
  "wait-timeout": Flags.integer({
    description: "The number of seconds to wait for the resource to be ready.",
    default: 600,
  }),
};

export async function waitUntil<T>(
  tester: () => Promise<T | null>,
  timeoutSeconds = 600,
): Promise<T> {
  let waited = 0;
  while (waited < timeoutSeconds) {
    const result = await tester();
    if (result) {
      return result;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    waited++;
  }

  throw new Error(
    `expected condition was not reached after ${timeoutSeconds} seconds`,
  );
}
