import { Args, Flags, Config } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { ArgOutput, FlagOutput } from "@oclif/core/lib/interfaces/parser.js";
import { normalizeProjectIdToUuid, normalizeServerIdToUuid } from "../../Helpers.js";
import { Context } from "../context.js";
import { makeFlagSet } from "../context_flags.js";

export const {
  flags: serverFlags,
  args: serverArgs,
  withId: withServerId,
} = makeFlagSet("server", "s", normalizeServerIdToUuid);