import { Args, Config, Flags } from "@oclif/core";
import {
  Arg,
  ArgOutput,
  FlagOutput,
  OptionFlag,
} from "@oclif/core/lib/interfaces/parser.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { AlphabetLowercase } from "@oclif/core/lib/interfaces/index.js";
import { Context } from "./context.js";

type ContextFlags = { [k: string]: OptionFlag<unknown> };
type ContextArgs = { [k: string]: Arg<unknown> };

export type FlagSet = {
  flags: ContextFlags;
  args: ContextArgs;
  withId: (
    apiClient: MittwaldAPIV2Client,
    flags: FlagOutput,
    args: ArgOutput,
    cfg: Config,
  ) => Promise<string>;
};

export type NormalizeFn = (
  apiClient: MittwaldAPIV2Client,
  id: string,
) => string | Promise<string>;

export function makeFlagSet(
  name: string,
  char: AlphabetLowercase,
  normalize: NormalizeFn = (_, id) => id,
): FlagSet {
  const flagName = `${name}-id`;
  const flags = {
    [flagName]: Flags.string({
      char,
      required: false,
      summary: `ID or short ID of a ${name}; this flag is optional if a default ${name} is set in the context`,
      description: `May contain a short ID or a full ID of a ${name}; you can also use the "<%= config.bin %> context set --${name}-id=<VALUE>" command to persistently set a default ${name} for all commands that accept this flag.`,
    }),
  } as ContextFlags;

  const args = {
    [flagName]: Args.string({
      description: `ID or short ID of a ${name}; this argument is optional if a default ${name} is set in the context`,
    }),
  } as ContextArgs;

  const idFromArgsOrFlag = (
    flags: FlagOutput,
    args: ArgOutput,
  ): string | undefined => {
    if (args[flagName]) {
      return args[flagName];
    }

    if (flags[flagName]) {
      return flags[flagName];
    }

    return undefined;
  };

  const withId = async (
    apiClient: MittwaldAPIV2Client,
    flags: FlagOutput,
    args: ArgOutput,
    cfg: Config,
  ): Promise<string> => {
    const idInput = idFromArgsOrFlag(flags, args);
    if (idInput) {
      return normalize(apiClient, idInput);
    }

    const idFromContext = await new Context(cfg).getContextValue(flagName);
    if (idFromContext) {
      return idFromContext;
    }

    throw new Error(
      `No ${name} ID given. Please specify one with --${flagName} or set a default server with 'mittwald context set --${flagName} <${flagName}>'`,
    );
  };

  return {
    flags,
    args,
    withId,
  };
}
