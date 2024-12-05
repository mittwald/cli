import { Flags } from "@oclif/core";
import Context from "../../lib/context/Context.js";
import { BaseCommand } from "../../lib/basecommands/BaseCommand.js";

export class Set extends BaseCommand {
  static summary = "Set context values for the current project, org or server";
  static description =
    "The context allows you to persistently set values for common parameters, like --project-id or --server-id, so you don't have to specify them on every command.";
  static flags = {
    "project-id": Flags.string({
      description: "ID or short ID of a project",
    }),
    "server-id": Flags.string({
      description: "ID or short ID of a server",
    }),
    "org-id": Flags.string({
      description: "ID or short ID of an organization",
    }),
    "installation-id": Flags.string({
      description: "ID or short ID of an app installation",
      aliases: ["app-id", "app-installation-id"],
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Set);
    const ctx = new Context(this.apiClient, this.config, {
      onInitError() {},
    });

    if (flags["project-id"]) {
      const projectId = await ctx.setProjectId(flags["project-id"]);
      this.log(`Set project ID to ${projectId}`);
    }

    if (flags["server-id"]) {
      const serverId = await ctx.setServerId(flags["server-id"]);
      this.log(`Set server ID to ${serverId}`);
    }

    if (flags["org-id"]) {
      const orgId = await ctx.setOrgId(flags["org-id"]);
      this.log(`Set organization ID to ${orgId}`);
    }

    if (flags["installation-id"]) {
      const installationId = await ctx.setAppInstallationId(
        flags["installation-id"],
      );
      this.log(`Set installation ID to ${installationId}`);
    }
  }
}
