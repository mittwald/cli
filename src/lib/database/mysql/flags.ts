import { Args, Config, Flags } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { ArgOutput, FlagOutput } from "@oclif/core/lib/interfaces/parser.js";
import { isUuid } from "../../../normalize_id.js";
import { withProjectId } from "../../project/flags.js";
import { assertStatus } from "@mittwald/api-client-commons";

export const mysqlConnectionFlags = {
  "mysql-password": Flags.string({
    char: "p",
    summary: "the password to use for the MySQL user (env: MYSQL_PWD)",
    description: `\
The password to use for the MySQL user. If not provided, the environment variable MYSQL_PWD will be used. If that is not set either, the command will interactively ask for the password.

NOTE: This is a security risk, as the password will be visible in the process list of your system, and will be visible in your Shell history. It is recommended to use the environment variable instead.\
      `,
    required: false,
    env: "MYSQL_PWD",
  }),
};

export const mysqlConnectionFlagsWithTempUser = {
  ...mysqlConnectionFlags,
  "temporary-user": Flags.boolean({
    summary: "create a temporary user for the dump",
    description:
      "Create a temporary user for this operation. This user will be deleted after the operation has completed. This is useful if you want to work with a database that is not accessible from the outside.\n\nIf this flag is disabled, you will need to specify the password of the default user; either via the --mysql-password flag or via the MYSQL_PWD environment variable.",
    default: true,
    required: false,
    allowNo: true,
  }),
};

export const mysqlArgs = {
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

export async function withMySQLId(
  apiClient: MittwaldAPIV2Client,
  flags: FlagOutput,
  args: ArgOutput,
  cfg: Config,
): Promise<string> {
  const candidate = getIdCandidate(flags, args);
  if (isUuid(candidate)) {
    return candidate;
  }

  const projectId = await withProjectId(apiClient, "flag", flags, args, cfg);
  const databases = await apiClient.database.listMysqlDatabases({
    projectId,
  });

  assertStatus(databases, 200);

  const database = databases.data.find((db) => db.name === candidate);
  if (!database) {
    throw new Error(`No database with name "${candidate}" found`);
  }

  return database.id;
}
