import { Flags } from "@oclif/core";
import { Context } from "../../lib/context.js";
import { BaseCommand } from "../../BaseCommand.js";
import {
  normalizeCustomerIdToUuid,
  normalizeProjectIdToUuid,
  normalizeServerIdToUuid,
} from "../../Helpers.js";

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
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Set);
    const ctx = new Context(this.config);

    if (flags["project-id"]) {
      const projectId = await normalizeProjectIdToUuid(
        this.apiClient,
        flags["project-id"],
      );
      await ctx.setProjectId(projectId);
      this.log(`Set project ID to ${projectId}`);
    }

    if (flags["server-id"]) {
      const serverId = await normalizeServerIdToUuid(
        this.apiClient,
        flags["server-id"],
      );
      await ctx.setServerId(serverId);
      this.log(`Set server ID to ${serverId}`);
    }

    if (flags["org-id"]) {
      const orgId = await normalizeCustomerIdToUuid(
        this.apiClient,
        flags["org-id"],
      );
      await ctx.setOrgId(orgId);
      this.log(`Set organization ID to ${orgId}`);
    }
  }
}
