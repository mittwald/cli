import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
import {
  getAppFromUuid,
  getAppInstallationFromUuid,
} from "../resources/app/uuid.js";

type AppLinkedDatabase = MittwaldAPIV2.Components.Schemas.AppLinkedDatabase;

export type LinkedDatabaseSummary = {
  databaseId: string;
  purpose: string;
  kind: "mysql" | "redis" | "unknown";
  name?: string;
};

export type AppSummary = {
  installationId: string;
  installationShortId?: string;
  appId: string;
  appName: string;
  installationPath: string;
  linkedDatabases: LinkedDatabaseSummary[];
};

export type StackSummary = {
  id: string;
  shortId?: string;
  description?: string;
  services: number;
  volumes: number;
};

export type ContainerSummary = {
  id: string;
  shortId?: string;
  name: string;
  status: string;
  stackId?: string;
};

export type ResolvedProjectContext = {
  projectId?: string;
  resolvedFrom?: "project-id" | "installation-id";
  unavailableReason?: string;
};

export type ProjectOverview = {
  projectId?: string;
  projectShortId?: string;
  projectName?: string;
  resolvedFrom?: "project-id" | "installation-id";
  apps: AppSummary[];
  stacks: StackSummary[];
  containers: ContainerSummary[];
  unavailableReason?: string;
};

export type OverviewEntryData = {
  shortId?: string;
  name: string;
  status: string;
  id: string;
};

export function formatOverviewEntry({
  shortId,
  name,
  status,
  id,
}: OverviewEntryData): string {
  return `${shortId ?? ""} ( ${name} ): ${status} ( ${id} )`;
}

export async function resolveProjectContext(
  apiClient: MittwaldAPIV2Client,
  contextProjectId: string | undefined,
  installationId: string | undefined,
): Promise<ResolvedProjectContext> {
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
}

export async function fetchProjectOverview(
  apiClient: MittwaldAPIV2Client,
  resolvedProject: ResolvedProjectContext,
): Promise<ProjectOverview> {
  const { projectId, resolvedFrom, unavailableReason } = resolvedProject;

  if (!projectId) {
    return {
      apps: [],
      stacks: [],
      containers: [],
      unavailableReason: unavailableReason ?? "project could not be resolved",
    };
  }

  try {
    const projectResponse = await apiClient.project.getProject({
      projectId,
    });
    assertStatus(projectResponse, 200);

    const appInstallationsResponse = await apiClient.app.listAppinstallations({
      projectId,
    });
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
        installationShortId: installation.shortId,
        appId: installation.appId,
        appName: appNames.get(installation.appId) ?? installation.appId,
        installationPath: installation.installationPath,
        linkedDatabases,
      };
    });

    let stacks: StackSummary[] = [];
    let containers: ContainerSummary[] = [];

    try {
      const [stackResponse, serviceResponse] = await Promise.all([
        apiClient.container.listStacks({ projectId }),
        apiClient.container.listServices({ projectId }),
      ]);
      assertStatus(stackResponse, 200);
      assertStatus(serviceResponse, 200);

      stacks = stackResponse.data.map((stack) => ({
        id: stack.id,
        shortId: (stack as { shortId?: string }).shortId,
        description: stack.description,
        services: stack.services?.length ?? 0,
        volumes: stack.volumes?.length ?? 0,
      }));

      containers = serviceResponse.data.map((service) => ({
        id: service.id,
        shortId: (service as { shortId?: string }).shortId,
        name: service.serviceName,
        status: service.status,
        stackId: service.stackId,
      }));
    } catch {
      // best effort
    }

    return {
      projectId,
      projectShortId: (projectResponse.data as { shortId?: string }).shortId,
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
}
