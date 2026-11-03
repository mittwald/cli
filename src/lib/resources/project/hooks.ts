import { useRenderContext } from "../../../rendering/react/context.js";
import { usePromise } from "@mittwald/react-use-promise";
import { assertStatus } from "@mittwald/api-client-commons";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { getProjectDiskUsage } from "./diskUsage.js";

type ProjectProject = MittwaldAPIV2.Components.Schemas.ProjectProject;

export function useProject(projectId: string): ProjectProject {
  const { apiClient } = useRenderContext();
  const project = usePromise(
    (projectId) =>
      apiClient.project.getProject({
        projectId,
      }),
    [projectId],
  );
  assertStatus(project, 200);

  return project.data;
}

export function useProjectDiskUsage(project: ProjectProject) {
  const { apiClient } = useRenderContext();
  return usePromise((p) => getProjectDiskUsage(apiClient, p), [project]);
}
