import { RenderBaseCommand } from "../../lib/basecommands/RenderBaseCommand.js";
import { FC, ReactNode } from "react";
import { SingleResult } from "../../rendering/react/components/SingleResult.js";
import { Value } from "../../rendering/react/components/Value.js";
import { usePromise } from "@mittwald/react-use-promise";
import { Note } from "../../rendering/react/components/Note.js";
import { Box, Text } from "ink";
import { Set as SetCommand } from "./set.js";
import { RenderJson } from "../../rendering/react/json/RenderJson.js";
import { useRenderContext } from "../../rendering/react/context.js";
import { LocalFilename } from "../../rendering/react/components/LocalFilename.js";
import Context, {
  ContextKey,
  ContextValue,
  ContextValueSource,
} from "../../lib/context/Context.js";
import {
  fetchProjectOverview,
  formatOverviewEntry,
  ProjectOverview,
  resolveProjectContext,
} from "../../lib/context/projectOverview.js";

const ContextSourceValue: FC<{ source: ContextValueSource }> = ({ source }) => {
  switch (source.type) {
    case "user":
      return (
        <ContextSourceKnownValue name="user configuration" source={source} />
      );
    case "terraform":
      return (
        <ContextSourceKnownValue
          name="terraform state file"
          source={source}
          relative
        />
      );
    case "ddev":
      return (
        <ContextSourceKnownValue
          name="DDEV configuration"
          source={source}
          relative
        />
      );
    case "dotfile":
      return (
        <ContextSourceKnownValue
          name=".mw-context.json"
          source={source}
          relative
        />
      );
    default:
      return <ContextSourceUnknown />;
  }
};

const ContextSourceKnownValue: FC<{
  name: string;
  source: ContextValueSource;
  relative?: boolean;
}> = ({ name, source, relative }) => {
  return (
    <Text>
      <Text color="yellow">{name}</Text>, in{" "}
      <LocalFilename filename={source.identifier} relative={relative} />
    </Text>
  );
};

const ContextSourceUnknown: FC = () => {
  return <Text color="yellow">unknown</Text>;
};

const ContextSource: FC<{ source: ContextValueSource }> = ({ source }) => {
  return (
    <Text color="gray">
      (source: <ContextSourceValue source={source} />)
    </Text>
  );
};

const ProjectOverviewSection: FC<{ overview: ProjectOverview }> = ({
  overview,
}) => {
  const stackDisplayById = new Map(
    overview.stacks.map((stack) => [stack.id, stack.shortId ?? ""]),
  );

  if (overview.unavailableReason) {
    return (
      <Note marginBottom={1}>
        Project overview is unavailable: {overview.unavailableReason}
      </Note>
    );
  }

  const rows: Record<string, ReactNode> = {
    Project: (
      <Text>
        <Value>{overview.projectName ?? overview.projectId}</Value>{" "}
        <Text color="gray">
          ({overview.projectShortId ?? overview.projectId})
        </Text>
      </Text>
    ),
    "Resolved from": <Value>{overview.resolvedFrom ?? "project-id"}</Value>,
  };

  rows["Apps"] =
    overview.apps.length > 0 ? (
      <Box flexDirection="column">
        {overview.apps.map((app) => (
          <Box key={app.installationId} flexDirection="column" marginBottom={1}>
            <Text color="green">
              {formatOverviewEntry({
                shortId: app.installationShortId,
                name: app.appName,
                status: `installed at ${app.installationPath}`,
                id: app.installationId,
              })}
            </Text>
            {app.linkedDatabases.length > 0 ? (
              app.linkedDatabases.map((db) => (
                <Text
                  key={`${app.installationId}-${db.databaseId}-${db.purpose}`}
                  color="gray"
                >
                  database {db.purpose}: {db.name ?? db.databaseId} ({db.kind})
                </Text>
              ))
            ) : (
              <Text color="gray">no linked databases</Text>
            )}
          </Box>
        ))}
      </Box>
    ) : (
      <Text color="gray">none found in this project</Text>
    );

  rows["Stacks"] =
    overview.stacks.length > 0 ? (
      <Box flexDirection="column">
        <Text>
          <Value>{overview.stacks.length}</Value> total
        </Text>
        {overview.stacks.slice(0, 5).map((stack) => (
          <Text key={stack.id} color="gray">
            {formatOverviewEntry({
              shortId: stack.shortId,
              name: stack.description ?? "stack",
              status: `${stack.services} services, ${stack.volumes} volumes`,
              id: stack.id,
            })}
          </Text>
        ))}
      </Box>
    ) : (
      <Text color="gray">none found in this project</Text>
    );

  rows["Containers"] =
    overview.containers.length > 0 ? (
      <Box flexDirection="column">
        <Text>
          <Value>{overview.containers.length}</Value> total
        </Text>
        {overview.containers.slice(0, 8).map((container) => {
          const stackShortId = container.stackId
            ? (stackDisplayById.get(container.stackId) ?? "")
            : "";
          const stackSuffix = container.stackId
            ? ` | stack ${stackShortId}`
            : "";

          return (
            <Text key={container.id} color="gray">
              {formatOverviewEntry({
                shortId: container.shortId,
                name: container.name,
                status: `${container.status}${stackSuffix}`,
                id: container.id,
              })}
            </Text>
          );
        })}
      </Box>
    ) : (
      <Text color="gray">none found in this project</Text>
    );

  return <SingleResult title="Project context overview" rows={rows} />;
};

const GetContext: FC<{ ctx: Context }> = ({ ctx }) => {
  const rows: Record<string, ReactNode> = {};
  const { renderAsJson, apiClient } = useRenderContext();
  const values: Record<string, ContextValue | undefined> = {};

  let hasTerraformSource = false;
  let hasDDEVSource = false;
  let hasDotfileSource = false;

  for (const key of [
    "project-id",
    "server-id",
    "org-id",
    "installation-id",
    "stack-id",
  ] as ContextKey[]) {
    const value = usePromise(ctx.getContextValue.bind(ctx), [key]);
    if (value) {
      rows[`--${key}`] = (
        <Text>
          <Value>{value.value}</Value> <ContextSource source={value.source} />
        </Text>
      );
      values[key] = value;

      hasTerraformSource =
        hasTerraformSource || value.source.type === "terraform";
      hasDDEVSource = hasDDEVSource || value.source.type === "ddev";
      hasDotfileSource = hasDotfileSource || value.source.type === "dotfile";
    } else {
      rows[`--${key}`] = <Value notSet />;
    }
  }

  const projectIdFromContext = values["project-id"]?.value;
  const appInstallationId = values["installation-id"]?.value;

  const resolvedProject = usePromise(
    (
      contextProjectId: string | undefined,
      installationId: string | undefined,
    ) => resolveProjectContext(apiClient, contextProjectId, installationId),
    [projectIdFromContext, appInstallationId],
  );

  const overview = usePromise(
    (resolvedProjectContext: {
      projectId?: string;
      resolvedFrom?: "project-id" | "installation-id";
      unavailableReason?: string;
    }): Promise<ProjectOverview> =>
      fetchProjectOverview(apiClient, resolvedProjectContext),
    [resolvedProject],
  );

  if (renderAsJson) {
    return (
      <>
        <RenderJson name={"context"} data={values} />
        <RenderJson name={"projectOverview"} data={overview} />
      </>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <SingleResult title="Current CLI context" rows={rows} />
      </Box>
      <Box marginBottom={1}>
        <ProjectOverviewSection overview={overview} />
      </Box>
      {hasTerraformSource && <TerraformHint />}
      {hasDDEVSource && <DDEVHint />}
      {hasDotfileSource && <DotfileHint />}
      <ContextSetHint />
    </Box>
  );
};

const TerraformHint: FC = () => (
  <Note marginBottom={1}>
    You are in a directory that contains a terraform state file; some of the
    context values were read from there.
  </Note>
);

const DDEVHint: FC = () => (
  <Note marginBottom={1}>
    You are in a directory that contains a DDEV project; some of the context
    values were read from there.
  </Note>
);

const DotfileHint: FC = () => (
  <Note marginBottom={1}>
    You are in a directory that contains a .mw-context.json file; some of the
    context values were read from there.
  </Note>
);

const ContextSetHint: FC = () => (
  <Note marginBottom={1}>
    Use the <Value>mw context set</Value> command to set one of the values
    listed above.
  </Note>
);

export class Get extends RenderBaseCommand<typeof Get> {
  static summary = "Print an overview of currently set context parameters";
  static description = SetCommand.description;
  static flags = { ...RenderBaseCommand.buildFlags() };

  protected render(): ReactNode {
    const ctx = new Context(this.apiClient, this.config);
    return <GetContext ctx={ctx} />;
  }
}
