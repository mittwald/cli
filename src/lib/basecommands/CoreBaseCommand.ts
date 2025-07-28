import { Command } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { readApiToken } from "../auth/token.js";

/**
 * Core base command class that provides common functionality but no
 * authentication flags. This is the base for both authenticated and
 * unauthenticated command hierarchies.
 */
export abstract class CoreBaseCommand extends Command {
  protected authenticationRequired = true;
  protected apiClient: MittwaldAPIV2Client =
    MittwaldAPIV2Client.newUnauthenticated();


  protected async getEffectiveToken(): Promise<string | undefined> {
    // Only check env and file - no --token flag in this base class
    return await readApiToken(this.config);
  }
}
