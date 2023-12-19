import { Args, Config, Flags } from "@oclif/core";
import {
  Arg,
  ArgOutput,
  FlagOutput,
  OptionFlag,
} from "@oclif/core/lib/interfaces/parser.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { AlphabetLowercase } from "@oclif/core/lib/interfaces/index.js";
import { Context, ContextKey, ContextNames } from "./context.js";

type ContextFlags<
  N extends ContextNames,
  TID extends string = ContextKey<N>,
> = {
  [k in TID]: OptionFlag<string>;
};
type ContextArgs<N extends ContextNames, TID extends string = ContextKey<N>> = {
  [k in TID]: Arg<string>;
};

export type CommandType<
  N extends ContextNames,
  TID extends string = ContextKey<N>,
> =
  | {
      flags: { [k in TID]: OptionFlag<string> };
    }
  | {
      args: { [k in TID]: Arg<string> };
    };

class MissingFlagError extends Error {
  constructor(name: string, flagName: string) {
    super(
      `No ${name} ID given. Please specify one with --${flagName} or set a default ${name} with 'mittwald context set --${flagName} <${flagName}>'`,
    );
  }
}

class MissingArgError extends Error {
  constructor(name: string, flagName: string) {
    super(
      `No ${name} ID given. Please specify one as positional argument or set a default ${name} with 'mittwald context set --${flagName} <${flagName}>'`,
    );
  }
}

export type FlagSet<TName extends ContextNames> = {
  name: TName;
  flags: ContextFlags<TName>;
  args: ContextArgs<TName>;
  withId: (
    apiClient: MittwaldAPIV2Client,
    command: CommandType<TName> | "flag" | "arg",
    flags: FlagOutput,
    args: ArgOutput,
    cfg: Config,
  ) => Promise<string>;
};

export type NormalizeFn = (
  apiClient: MittwaldAPIV2Client,
  id: string,
) => string | Promise<string>;

export function makeFlagSet<TName extends ContextNames>(
  name: TName,
  char: AlphabetLowercase,
  normalize: NormalizeFn = (_, id) => id,
): FlagSet<TName> {
  const flagName: ContextKey<TName> = `${name}-id`;
  const flags = {
    [flagName]: Flags.string({
      char,
      required: false,
      summary: `ID or short ID of a ${name}; this flag is optional if a default ${name} is set in the context`,
      description: `May contain a short ID or a full ID of a ${name}; you can also use the "<%= config.bin %> context set --${name}-id=<VALUE>" command to persistently set a default ${name} for all commands that accept this flag.`,
      default: undefined,
    }),
  } as ContextFlags<TName>;

  const args = {
    [flagName]: Args.string({
      description: `ID or short ID of a ${name}; this argument is optional if a default ${name} is set in the context`,
    }),
  } as ContextArgs<TName>;

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
    commandType: CommandType<TName> | "flag" | "arg",
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
      return idFromContext.value;
    }

    if (commandType === "flag") {
      throw new MissingFlagError(name, flagName);
    }

    if (commandType === "arg") {
      throw new MissingArgError(name, flagName);
    }

    if ("flags" in commandType && flagName in commandType.flags) {
      throw new MissingFlagError(name, flagName);
    }

    if ("args" in commandType && flagName in commandType.args) {
      throw new MissingArgError(name, flagName);
    }

    throw new Error(
      `No ${name} ID given. Please consult the --help page of this command or set a default ${name} with 'mittwald context set --${flagName} <${flagName}>'`,
    );
  };

  return {
    name,
    flags,
    args,
    withId,
  };
}
