import { Flags } from "@oclif/core";

export const ddevFlags = {
  "override-type": Flags.string({
    summary: "Override the type of the generated DDEV configuration",
    default: "auto",
    description:
      "The type of the generated DDEV configuration; this can be any of the documented DDEV project types, or 'auto' (which is also the default) for automatic discovery." +
      "" +
      "See https://ddev.readthedocs.io/en/latest/users/configuration/config/#type for more information",
  }),
};
