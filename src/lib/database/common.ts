import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ProcessRenderer } from "../../rendering/process/process.js";
import { assertStatus } from "@mittwald/api-client-commons";
type ProjectProject = MittwaldAPIV2.Components.Schemas.ProjectProject;
type SignupAccount = MittwaldAPIV2.Components.Schemas.SignupAccount;

export async function getUser(
  apiClient: MittwaldAPIV2Client,
  p: ProcessRenderer,
): Promise<SignupAccount> {
  return await p.runStep("fetching user", async () => {
    const r = await apiClient.user.getOwnAccount();
    assertStatus(r, 200);

    return r.data;
  });
}

export async function getProject(
  apiClient: MittwaldAPIV2Client,
  p: ProcessRenderer,
  database: { projectId: string },
): Promise<ProjectProject> {
  return await p.runStep("fetching project", async () => {
    const r = await apiClient.project.getProject({
      projectId: database.projectId,
    });
    assertStatus(r, 200);

    return r.data;
  });
}
