import { Flags } from "@oclif/core";
import { InferredFlags } from "@oclif/core/lib/interfaces/index.js";
import { knownDDEVProjectTypes } from "./init_projecttype.js";

const ddevDatabaseFlags = {
  "database-id": Flags.string({
    summary: "ID of the application database",
    description:
      "The ID of the database to use for the DDEV project; if set to 'auto', the command will use the database linked to the app installation.\n" +
      "\n" +
      "Setting a database ID (either automatically or manually) is required. To create a DDEV project without a database, set the --without-database flag.",
    required: false,
    default: undefined,
  }),
  "without-database": Flags.boolean({
    summary: "Create a DDEV project without a database",
    description:
      "Use this flag to create a DDEV project without a database; this is useful for projects that do not require a database.",
    default: false,
    exclusive: ["database-id"],
  }),
};

export const ddevFlags = {
  "override-type": Flags.string({
    summary: "Override the type of the generated DDEV configuration",
    default: "auto",
    options: [...knownDDEVProjectTypes, "auto"] as const,
    description:
      "The type of the generated DDEV configuration; this can be any of the documented DDEV project types, or 'auto' (which is also the default) for automatic discovery." +
      "\n\n" +
      "See https://ddev.readthedocs.io/en/latest/users/configuration/config/#type for more information",
  }),
  ...ddevDatabaseFlags,
};

export type DDEVDatabaseFlags = InferredFlags<typeof ddevDatabaseFlags>;
