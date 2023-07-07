import { FlagSupportedSetup } from "./FlagSupportedSetup.js";
import { Flags } from "@oclif/core";

export interface UsePromiseOptions {
  autoRefresh: any;
}

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
