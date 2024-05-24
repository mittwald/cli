import { Flags } from "@oclif/core";
import Duration from "./units/Duration.js";
import { InferredFlags } from "@oclif/core/lib/interfaces/index.js";

export const waitFlags = {
  wait: Flags.boolean({
    char: "w",
    description: "wait for the resource to be ready.",
  }),
  "wait-timeout": Duration.relativeFlag({
    description:
      "the duration to wait for the resource to be ready (common units like 'ms', 's', 'm' are accepted).",
    default: Duration.fromSeconds(600),
  }),
};

export type WaitFlags = InferredFlags<typeof waitFlags>;

export async function waitUntil<T>(
  tester: () => Promise<T | null>,
  timeout = Duration.fromSeconds(600),
): Promise<T> {
  let waited = Duration.fromZero();
  while (waited.compare(timeout) < 0) {
    const result = await tester();
    if (result) {
      return result;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    waited = waited.add(Duration.fromSeconds(1));
  }

  throw new Error(
    `expected condition was not reached after ${timeout.toString()}`,
  );
}
