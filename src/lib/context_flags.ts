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

export type FlagSet = {
  flags: { [k: string]: OptionFlag<any> };
  args: { [k: string]: Arg<any> };
  withId: (
    apiClient: MittwaldAPIV2Client,
    flags: FlagOutput,
    args: ArgOutput,
    cfg: Config,
  ) => Promise<string>;
};

export type NormalizeFn = (apiClient: MittwaldAPIV2Client, id: string) => Promise<string>;

export function makeFlagSet(name: string, char: AlphabetLowercase, normalize: NormalizeFn): FlagSet {
  const flagName = `${name}-id`;
  const flags = {
    [flagName]: Flags.string({
      char,
      required: false,
      description: `ID or short ID of a ${name}; this flag is optional if a default ${name} is set in the context`,
    })
  }

  const args = {
    [flagName]: Args.string({
      description: `ID or short ID of a ${name}; this argument is optional if a default ${name} is set in the context`,
    })
  }

  const idFromArgsOrFlag = (flags: FlagOutput, args: ArgOutput): string | undefined => {
    if (args[flagName]) {
      return args[flagName];
    }

    if (flags[flagName]) {
      return flags[flagName];
    }

    return undefined;
  }

  const withId = async (apiClient: MittwaldAPIV2Client, flags: FlagOutput, args: ArgOutput, cfg: Config): Promise<string> => {
    const idInput = idFromArgsOrFlag(flags, args);
    if (idInput) {
      return normalize(apiClient, idInput);
    }

    const idFromContext = await new Context(cfg).getContextValue(flagName);
    if (idFromContext) {
      return idFromContext;
    }

    throw new Error(`No ${name} ID given. Please specify one with --${flagName} or set a default server with 'mittwald context set --${flagName} <${flagName}>'`);
  }

  return {
    flags,
    args,
    withId,
  }
}