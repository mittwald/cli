import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function seedProjectContext(projectId: string): Promise<void> {
  const configDir = process.env.MW_CONFIG_DIR;

  if (!configDir) {
    throw new Error(
      "[integration:run-all-commands] MW_CONFIG_DIR was not set before seeding project context.",
    );
  }

  const contextFile = path.join(configDir, "context.json");

  await mkdir(configDir, { recursive: true });
  await writeFile(
    contextFile,
    JSON.stringify({
      "project-id": projectId,
      "server-id": "6b4f48f5-d80c-4d20-9db8-fecf4c9e6221",
      "installation-id": "f7b47c12-7d11-4f3a-b9bc-1b3c706e1d55",
      "org-id": "88e8d927-7db4-42ef-ae02-f8a7ef0b4d77",
    }),
    "utf-8",
  );
}
