import FlagSetBuilder, {
  CommandType,
  ContextArgs,
  ContextFlags,
  makeMissingContextInputError,
} from "../../context/FlagSetBuilder.js";
import Context, {
  contextIDNormalizers,
  ContextKey,
  ContextNames,
} from "../../context/Context.js";
import { AlphabetLowercase } from "@oclif/core/lib/interfaces/index.js";
import { Args, Config, Flags } from "@oclif/core";
import { ArgOutput, FlagOutput } from "@oclif/core/lib/interfaces/parser.js";
import { MittwaldAPIV2Client, assertStatus } from "@mittwald/api-client";
import { articleForWord } from "../../language.js";
import FlagSet from "../../context/FlagSet.js";
import { validate as validateUuid } from "uuid";

async function normalize(
  apiClient: MittwaldAPIV2Client,
  projectId: string,
): Promise<string> {
  const result = await apiClient.project.getProject({ projectId });
  assertStatus(result, 200);

  return result.data.id;
}

contextIDNormalizers["project-id"] = normalize;

export const {
  flags: projectFlags,
  args: projectArgs,
  withId: withProjectId,
} = new FlagSetBuilder("project", "p", {
  normalize,
  expectedShortIDFormat: {
    pattern: /^p-.*/,
    display: "p-XXXXXX",
  },
}).build();

export type SubNormalizeFn = (
  apiClient: MittwaldAPIV2Client,
  projectId: string,
  id: string,
) => string | Promise<string>;

export type ProjectFlagSetOpts = {
  normalize: SubNormalizeFn;
  shortIDName: string;
  displayName: string;
  supportsContext: boolean;
};

export function makeProjectFlagSet<TName extends ContextNames>(
  name: TName,
  char: AlphabetLowercase,
  opts: Partial<ProjectFlagSetOpts> = {},
): FlagSet<TName | "project"> {
  const {
    normalize = (_1, _2, id) => id,
    shortIDName = "short ID",
    displayName = name,
    supportsContext = false,
  } = opts;
  const article = articleForWord(displayName);

  const flagName: ContextKey<TName> = `${name}-id`;
  const flags = {
    ...projectFlags,
    [flagName]: Flags.string({
      char,
      required: !supportsContext,
      summary: `ID or ${shortIDName} of ${article} ${displayName}`,
      description: `May contain a ${shortIDName} or a full ID of ${article} ${displayName}.`,
      default: undefined,
    }),
  } as ContextFlags<TName | "project">;

  const args = {
    [flagName]: Args.string({
      description: `ID or ${shortIDName} of ${article} ${displayName}`,
      required: !supportsContext,
    }),
  } as ContextArgs<TName | "project">;

  if (supportsContext) {
    flags[flagName].summary +=
      `; this flag is optional if a default ${displayName} is set in the context`;
    flags[flagName].description +=
      `; you can also use the "<%= config.bin %> context set --${flagName}=<VALUE>" command to persistently set a default ${displayName} for all commands that accept this flag.`;
    args[flagName].description +=
      `; this argument is optional if a default ${displayName} is set in the context`;
  }

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
    const idInput = idFromArgsOrFlag(flags, args);
    if (idInput) {
      if (validateUuid(idInput)) {
        return idInput;
      }

      const projectId = await withProjectId(
        apiClient,
        commandType,
        flags,
        args,
        cfg,
      );
      return normalize(apiClient, projectId, idInput);
    }

    const idFromContext = await new Context(apiClient, cfg).getContextValue(
      flagName,
    );
    if (idFromContext) {
      return idFromContext.value;
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
