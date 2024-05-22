import { Command } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { configureAxiosRetry } from "../api_retry.js";
import { configureConsistencyHandling } from "../api_consistency.js";
import { getTokenFilename, readApiToken } from "../auth/token.js";
import { configureAxiosLogging } from "../api_logging.js";

export abstract class BaseCommand extends Command {
  protected authenticationRequired = true;
  protected apiClient: MittwaldAPIV2Client =
    MittwaldAPIV2Client.newUnauthenticated();

  public async init(): Promise<void> {
    await super.init();
    if (this.authenticationRequired) {
      const token = await readApiToken(this.config);
      if (token === undefined) {
        throw new Error(
          `Could not get token from either config file (${getTokenFilename(this.config)}) or environment`,
        );
      }

      this.apiClient = MittwaldAPIV2Client.newWithToken(token);
      this.apiClient.axios.defaults.headers["User-Agent"] =
        `mittwald-cli/${this.config.version}`;

      configureAxiosLogging(this.apiClient.axios);
      configureAxiosRetry(this.apiClient.axios);
      configureConsistencyHandling(this.apiClient.axios);
    }
  }
}
