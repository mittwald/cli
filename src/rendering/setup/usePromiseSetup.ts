import { FlagSupportedSetup } from "./FlagSupportedSetup.js";
import { Flags } from "@oclif/core";
import { usePromise } from "@mittwald/react-use-promise";
import { Simplify } from "@mittwald/api-client-commons";

type UsePromiseOptions = Simplify<Parameters<typeof usePromise>[2]>;

export const UsePromiseRenderSetup = FlagSupportedSetup.build(
  {
    wait: Flags.boolean(),
  },
  { refreshIntervalSeconds: 5 },
  (flags, settings): UsePromiseOptions => ({
    autoRefresh: flags.wait
      ? {
          seconds: settings.refreshIntervalSeconds,
        }
      : undefined,
  }),
);
