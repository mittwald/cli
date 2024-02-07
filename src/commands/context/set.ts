import { Flags } from "@oclif/core";
import { Context } from "../../lib/context.js";
import { BaseCommand } from "../../BaseCommand.js";
import {
  normalizeAppInstallationId,
  normalizeCustomerId,
  normalizeProjectId,
  normalizeServerId,
} from "../../normalize_id.js";

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
    const ctx = new Context(this.config);

    if (flags["project-id"]) {
      const projectId = await normalizeProjectId(
        this.apiClient,
        flags["project-id"],
      );
      await ctx.setProjectId(projectId);
      this.log(`Set project ID to ${projectId}`);
    }

    if (flags["server-id"]) {
      const serverId = await normalizeServerId(
        this.apiClient,
        flags["server-id"],
      );
      await ctx.setServerId(serverId);
      this.log(`Set server ID to ${serverId}`);
    }

    if (flags["org-id"]) {
      const orgId = await normalizeCustomerId(this.apiClient, flags["org-id"]);
      await ctx.setOrgId(orgId);
      this.log(`Set organization ID to ${orgId}`);
    }

    if (flags["installation-id"]) {
      const installationId = await normalizeAppInstallationId(
        this.apiClient,
        flags["installation-id"],
      );
      await ctx.setAppInstallationId(installationId);
      this.log(`Set installation ID to ${installationId}`);
    }
  }
}
