import { useRenderContext } from "../../rendering/react/context.js";
import { usePromise } from "@mittwald/react-use-promise";
import { assertStatus } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import ProjectProject = MittwaldAPIV2.Components.Schemas.ProjectProject;

export function useProject(projectId: string): ProjectProject {
  const { apiClient } = useRenderContext();
  const project = usePromise(
    (id) =>
      apiClient.project.getProject({
        pathParameters: { id },
      }),
    [projectId],
  );
  assertStatus(project, 200);

  return project.data;
}
