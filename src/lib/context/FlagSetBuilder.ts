import { Args, Config, Flags } from "@oclif/core";
import { AlphabetLowercase, Arg, OptionFlag } from "@oclif/core/interfaces";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import Context, { ContextKey, ContextNames } from "./Context.js";
import UnexpectedShortIDPassedError from "../error/UnexpectedShortIDPassedError.js";
import FlagSet from "./FlagSet.js";
import { validate as validateUuid } from "uuid";
import { articleForWord } from "../util/language/articleForWord.js";

export type ContextFlags<
  N extends ContextNames,
  TID extends string = ContextKey<N>,
> = {
  [k in TID]: OptionFlag<string>;
};

export type ContextArgs<
  N extends ContextNames,
  TID extends string = ContextKey<N>,
> = {
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

export class MissingFlagError extends Error {
  constructor(name: string, flagName: string) {
    super(
      `No ${name} ID given. Please specify one with --${flagName} or set a default ${name} with 'mw context set --${flagName} <${flagName}>'`,
    );
  }
}

export class MissingArgError extends Error {
  constructor(name: string, flagName: string) {
    super(
      `No ${name} ID given. Please specify one as positional argument or set a default ${name} with 'mw context set --${flagName} <${flagName}>'`,
    );
  }
}

export type FlagSetOptions = {
  normalize: NormalizeFn;
  displayName: string;
  retrieveFromContext: boolean;
  expectedShortIDFormat: {
    pattern: RegExp;
    display: string;
  };
};

export type NormalizeFn = (
  apiClient: MittwaldAPIV2Client,
  id: string,
) => string | Promise<string>;

export function makeMissingContextInputError<TName extends ContextNames>(
  commandType:
    | { flags: { [k in ContextKey<TName>]: OptionFlag<string> } }
    | {
        args: { [k in ContextKey<TName>]: Arg<string> };
      }
    | "flag"
    | "arg",
  name: TName,
  flagName: `${TName}-id`,
  contextSupport: boolean = true,
): Error {
  if (commandType === "flag") {
    return new MissingFlagError(name, flagName);
  }

  if (commandType === "arg") {
    return new MissingArgError(name, flagName);
  }

  if ("flags" in commandType && flagName in commandType.flags) {
    return new MissingFlagError(name, flagName);
  }

  if ("args" in commandType && flagName in commandType.args) {
    return new MissingArgError(name, flagName);
  }

  if (contextSupport) {
    return new Error(
      `No ${name} ID given. Please consult the --help page of this command or set a default ${name} with 'mw context set --${flagName} <${flagName}>'`,
    );
  }

  return new Error(
    `No ${name} ID given. Please consult the --help page of this command.`,
  );
}

export default class FlagSetBuilder<TName extends ContextNames> {
  private readonly name: TName;
  private readonly char: AlphabetLowercase;
  private readonly opts: Partial<FlagSetOptions>;
  private readonly flagName: ContextKey<TName>;

  public constructor(
    name: TName,
    char: AlphabetLowercase,
    opts: Partial<FlagSetOptions> = {},
  ) {
    this.name = name;
    this.char = char;
    this.flagName = `${name}-id`;
    this.opts = opts;
  }

  private get displayName(): string {
    return this.opts.displayName ?? this.name;
  }

  private buildIDFromArgsOrFlag(): (
    flags: { [key: string]: unknown },
    args: { [key: string]: unknown },
  ) => string | undefined {
    return (flags, args): string | undefined => {
      if (args[this.flagName] && typeof args[this.flagName] === "string") {
        return args[this.flagName] as string;
      }

      if (flags[this.flagName] && typeof flags[this.flagName] === "string") {
        return flags[this.flagName] as string;
      }

      return undefined;
    };
  }

  private buildFlags(): ContextFlags<TName> {
    const { displayName } = this;
    const article = articleForWord(displayName);
    const { retrieveFromContext = true } = this.opts;

    let summary = `ID or short ID of ${article} ${displayName}`;
    let description = `May contain a short ID or a full ID of ${article} ${displayName}`;

    if (retrieveFromContext) {
      summary += `; this flag is optional if a default ${displayName} is set in the context`;
      description += `; you can also use the "<%= config.bin %> context set --${this.flagName}=<VALUE>" command to persistently set a default ${displayName} for all commands that accept this flag.`;
    } else {
      summary += ".";
      description += ".";
    }

    return {
      [this.flagName]: Flags.string({
        char: this.char,
        required: !retrieveFromContext,
        summary,
        description,
        default: undefined,
      }),
    } as ContextFlags<TName>;
  }

  private buildArgs(): ContextArgs<TName> {
    const { displayName } = this;
    const article = articleForWord(displayName);
    const { retrieveFromContext = true } = this.opts;

    let description = `ID or short ID of ${article} ${displayName}`;
    if (retrieveFromContext) {
      description += `; this argument is optional if a default ${displayName} is set in the context.`;
    } else {
      description += ".";
    }

    return {
      [this.flagName]: Args.string({
        description,
        required: !retrieveFromContext,
      }),
    } as ContextArgs<TName>;
  }

  private buildSanityCheck(): (id: string) => void {
    if (!this.opts.expectedShortIDFormat) {
      return (): void => {};
    }

    const format = this.opts.expectedShortIDFormat;
    return (id: string): void => {
      if (!validateUuid(id) && !format.pattern.test(id)) {
        throw new UnexpectedShortIDPassedError(
          this.displayName,
          format.display,
        );
      }
    };
  }

  private buildIDGetter() {
    const idInputSanityCheck = this.buildSanityCheck();
    const idFromArgsOrFlag = this.buildIDFromArgsOrFlag();
    const { normalize = (_, id) => id, retrieveFromContext = true } = this.opts;

    return async (
      apiClient: MittwaldAPIV2Client,
      commandType: CommandType<TName> | "flag" | "arg",
      flags: { [key: string]: unknown },
      args: { [key: string]: unknown },
      cfg: Config,
    ): Promise<string> => {
      const idInput = idFromArgsOrFlag(flags, args);
      if (idInput) {
        idInputSanityCheck(idInput);
        return normalize(apiClient, idInput);
      }

      if (retrieveFromContext) {
        const context = new Context(apiClient, cfg);
        const idFromContext = await context.getContextValue(this.flagName);
        if (idFromContext) {
          return idFromContext.value;
        }
      }

      throw makeMissingContextInputError<TName>(
        commandType,
        this.name,
        this.flagName,
      );
    };
  }

  public build(): FlagSet<TName> {
    return {
      name: this.name,
      flags: this.buildFlags(),
      args: this.buildArgs(),
      withId: this.buildIDGetter(),
    };
  }
}

/**
 * Helper function for building a FlagSet.
 *
 * @deprecated Use FlagSetBuilder directly instead.
 */
export function makeFlagSet<TName extends ContextNames>(
  name: TName,
  char: AlphabetLowercase,
  opts: Partial<FlagSetOptions> = {},
): FlagSet<TName> {
  return new FlagSetBuilder(name, char, opts).build();
}
