import { Args, Config } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { ArgOutput, FlagOutput } from "@oclif/core/lib/interfaces/parser.js";
import { withProjectId } from "../../project/flags.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { validate as validateUuid } from "uuid";

export const redisArgs = {
  "database-id": Args.string({
    description:
      "The ID of the database (when a project context is set, you can also use the name)",
    required: true,
  }),
};

function getIdCandidate(flags: FlagOutput, args: ArgOutput): string {
  if (args["database-id"]) {
    return args["database-id"];
  }

  if (flags["database-id"]) {
    return flags["database-id"];
  }

  throw new Error("No ID given");
}

export async function withRedisId(
  apiClient: MittwaldAPIV2Client,
  flags: FlagOutput,
  args: ArgOutput,
  cfg: Config,
): Promise<string> {
  const candidate = getIdCandidate(flags, args);
  if (validateUuid(candidate)) {
    return candidate;
  }

  const projectId = await withProjectId(apiClient, "flag", flags, args, cfg);
  const databases = await apiClient.database.listRedisDatabases({
    projectId,
  });

  assertStatus(databases, 200);

  const database = databases.data.find((db) => db.name === candidate);
  if (!database) {
    throw new Error(`No database with name "${candidate}" found`);
  }

  return database.id;
}
