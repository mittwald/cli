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
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
import Context, {
  ContextKey,
  ContextValue,
  ContextValueSource,
} from "../../lib/context/Context.js";
import {
  getAppFromUuid,
  getAppInstallationFromUuid,
} from "../../lib/resources/app/uuid.js";

type AppLinkedDatabase = MittwaldAPIV2.Components.Schemas.AppLinkedDatabase;

type LinkedDatabaseSummary = {
  databaseId: string;
  purpose: string;
  kind: "mysql" | "redis" | "unknown";
  name?: string;
};

type AppSummary = {
  installationId: string;
  appId: string;
  appName: string;
  installationPath: string;
  linkedDatabases: LinkedDatabaseSummary[];
};

type StackSummary = {
  id: string;
  description?: string;
  services: number;
  volumes: number;
};

type ContainerSummary = {
  id: string;
  name: string;
  status: string;
  stackId?: string;
};

type ProjectOverview = {
  projectId?: string;
  projectName?: string;
  resolvedFrom?: "project-id" | "installation-id";
  apps: AppSummary[];
  stacks: StackSummary[];
  containers: ContainerSummary[];
  unavailableReason?: string;
};

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
        <Text color="gray">({overview.projectId})</Text>
      </Text>
    ),
    "Resolved from": <Value>{overview.resolvedFrom ?? "project-id"}</Value>,
  };

  if (overview.apps.length > 0) {
    rows["Apps"] = (
      <Box flexDirection="column">
        {overview.apps.map((app) => (
          <Box key={app.installationId} flexDirection="column" marginBottom={1}>
            <Text>
              <Value>{app.appName}</Value>{" "}
              <Text color="gray">
                ({app.installationPath}, {app.installationId})
              </Text>
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
    );
  } else {
    rows["Apps"] = <Text color="gray">none found in this project</Text>;
    rows["Stacks"] = (
      <Box flexDirection="column">
        <Text>
          <Value>{overview.stacks.length}</Value> total
        </Text>
        {overview.stacks.slice(0, 5).map((stack) => (
          <Text key={stack.id} color="gray">
            {stack.id}: {stack.services} services, {stack.volumes} volumes
            {stack.description ? ` (${stack.description})` : ""}
          </Text>
        ))}
      </Box>
    );
    rows["Containers"] = (
      <Box flexDirection="column">
        <Text>
          <Value>{overview.containers.length}</Value> total
        </Text>
        {overview.containers.slice(0, 8).map((container) => (
          <Text key={container.id} color="gray">
            {container.name}: {container.status}
            {container.stackId ? ` (stack ${container.stackId})` : ""}
          </Text>
        ))}
      </Box>
    );
  }

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
    async (
      contextProjectId: string | undefined,
      installationId: string | undefined,
    ): Promise<{
      projectId?: string;
      resolvedFrom?: "project-id" | "installation-id";
      unavailableReason?: string;
    }> => {
      if (contextProjectId) {
        return { projectId: contextProjectId, resolvedFrom: "project-id" };
      }

      if (!installationId) {
        return {
          unavailableReason:
            "no project-id in context and no installation-id to derive it from",
        };
      }

      try {
        const installation = await getAppInstallationFromUuid(
          apiClient,
          installationId,
        );
        return {
          projectId: installation.projectId,
          resolvedFrom: "installation-id",
        };
      } catch {
        return {
          unavailableReason: "could not resolve project from installation-id",
        };
      }
    },
    [projectIdFromContext, appInstallationId],
  );

  const overview = usePromise(
    async (
      projectId: string | undefined,
      resolvedFrom: "project-id" | "installation-id" | undefined,
      unavailableReason: string | undefined,
    ): Promise<ProjectOverview> => {
      if (!projectId) {
        return {
          apps: [],
          stacks: [],
          containers: [],
          unavailableReason:
            unavailableReason ?? "project could not be resolved",
        };
      }

      try {
        const projectResponse = await apiClient.project.getProject({
          projectId,
        });
        assertStatus(projectResponse, 200);

        const appInstallationsResponse =
          await apiClient.app.listAppinstallations({ projectId });
        assertStatus(appInstallationsResponse, 200);

        const appInstallations = appInstallationsResponse.data;
        const uniqueAppIds = Array.from(
          new Set(appInstallations.map((installation) => installation.appId)),
        );

        const appNames = new Map<string, string>();
        await Promise.all(
          uniqueAppIds.map(async (appId) => {
            try {
              const app = await getAppFromUuid(apiClient, appId);
              appNames.set(appId, app.name);
            } catch {
              appNames.set(appId, appId);
            }
          }),
        );

        const databaseById = new Map<
          string,
          { name: string; kind: "mysql" | "redis" }
        >();

        try {
          const mysqlResponse = await apiClient.database.listMysqlDatabases({
            projectId,
          });
          assertStatus(mysqlResponse, 200);
          for (const db of mysqlResponse.data) {
            databaseById.set(db.id, { name: db.name, kind: "mysql" });
          }
        } catch {
          // best effort
        }

        try {
          const redisResponse = await apiClient.database.listRedisDatabases({
            projectId,
          });
          assertStatus(redisResponse, 200);
          for (const db of redisResponse.data) {
            databaseById.set(db.id, { name: db.name, kind: "redis" });
          }
        } catch {
          // best effort
        }

        const apps: AppSummary[] = appInstallations.map((installation) => {
          const linkedDatabases: LinkedDatabaseSummary[] =
            installation.linkedDatabases.map((linked: AppLinkedDatabase) => {
              const resolved = databaseById.get(linked.databaseId);
              return {
                databaseId: linked.databaseId,
                purpose: linked.purpose,
                kind: resolved?.kind ?? "unknown",
                name: resolved?.name,
              };
            });

          return {
            installationId: installation.id,
            appId: installation.appId,
            appName: appNames.get(installation.appId) ?? installation.appId,
            installationPath: installation.installationPath,
            linkedDatabases,
          };
        });

        if (apps.length > 0) {
          return {
            projectId,
            projectName: projectResponse.data.description,
            resolvedFrom,
            apps,
            stacks: [],
            containers: [],
          };
        }

        const stackResponse = await apiClient.container.listStacks({
          projectId,
        });
        assertStatus(stackResponse, 200);

        const serviceResponse = await apiClient.container.listServices({
          projectId,
        });
        assertStatus(serviceResponse, 200);

        const stacks: StackSummary[] = stackResponse.data.map((stack) => ({
          id: stack.id,
          description: stack.description,
          services: stack.services?.length ?? 0,
          volumes: stack.volumes?.length ?? 0,
        }));

        const containers: ContainerSummary[] = serviceResponse.data.map(
          (service) => ({
            id: service.id,
            name: service.serviceName,
            status: service.status,
            stackId: service.stackId,
          }),
        );

        return {
          projectId,
          projectName: projectResponse.data.description,
          resolvedFrom,
          apps,
          stacks,
          containers,
        };
      } catch {
        return {
          projectId,
          resolvedFrom,
          apps: [],
          stacks: [],
          containers: [],
          unavailableReason:
            "project-level data could not be fetched with current access/context",
        };
      }
    },
    [
      resolvedProject.projectId,
      resolvedProject.resolvedFrom,
      resolvedProject.unavailableReason,
    ],
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
