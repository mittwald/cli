import { CoreBaseCommand } from "./CoreBaseCommand.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";

/**
 * Base command class for commands that do not require authentication. This
 * class extends CoreBaseCommand directly, bypassing the --token flag from
 * BaseCommand.
 */
export abstract class UnauthenticatedBaseCommand extends CoreBaseCommand {
  // No baseFlags defined - we don't want the --token flag for these commands
  protected authenticationRequired = false;

  public async init(): Promise<void> {
    await super.init();
    // For unauthenticated commands, keep the unauthenticated API client
    this.apiClient = this.apiClient || MittwaldAPIV2Client.newUnauthenticated();
  }
}
