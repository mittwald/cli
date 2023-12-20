import { normalizeProjectIdToUuid } from "../../Helpers.js";
import {
  CommandType,
  ContextArgs,
  ContextFlags,
  FlagSet,
  makeFlagSet,
  makeMissingContextInputError,
} from "../context_flags.js";
import { ContextKey, ContextNames } from "../context.js";
import { AlphabetLowercase } from "@oclif/core/lib/interfaces/index.js";
import { Args, Config, Flags } from "@oclif/core";
import { ArgOutput, FlagOutput } from "@oclif/core/lib/interfaces/parser.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";

export const {
  flags: projectFlags,
  args: projectArgs,
  withId: withProjectId,
} = makeFlagSet("project", "p", normalizeProjectIdToUuid);

export type SubNormalizeFn = (
  apiClient: MittwaldAPIV2Client,
  projectId: string,
  id: string,
) => string | Promise<string>;

export type ProjectFlagSetOpts = {
  shortIDName: string;
};

export function makeProjectFlagSet<TName extends ContextNames>(
  name: TName,
  char: AlphabetLowercase,
  normalize: SubNormalizeFn = (_1, _2, id) => id,
  opts: Partial<ProjectFlagSetOpts> = {},
): FlagSet<TName | "project"> {
  const { shortIDName = "short ID" } = opts;

  const flagName: ContextKey<TName> = `${name}-id`;
  const flags = {
    ...projectFlags,
    [flagName]: Flags.string({
      char,
      required: true,
      summary: `ID or ${shortIDName} of a ${name}`,
      description: `May contain a ${shortIDName} or a full ID of a ${name}.`,
      default: undefined,
    }),
  } as ContextFlags<TName | "project">;

  const args = {
    [flagName]: Args.string({
      description: `ID or ${shortIDName} of a ${name}`,
      required: true,
    }),
  } as ContextArgs<TName | "project">;

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
    commandType: CommandType<TName | "project"> | "flag" | "arg",
    flags: FlagOutput,
    args: ArgOutput,
    cfg: Config,
  ): Promise<string> => {
    const projectId = await withProjectId(
      apiClient,
      commandType,
      flags,
      args,
      cfg,
    );

    const idInput = idFromArgsOrFlag(flags, args);
    if (idInput) {
      return normalize(apiClient, projectId, idInput);
    }

    throw makeMissingContextInputError<TName>(
      commandType,
      name,
      flagName,
      false,
    );
  };

  return {
    name,
    flags,
    args,
    withId,
  };
}
