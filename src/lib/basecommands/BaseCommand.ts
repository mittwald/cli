import { Flags } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { getTokenFilename, readApiToken } from "../auth/token.js";
import { CoreBaseCommand } from "./CoreBaseCommand.js";
import { configureAxiosLogging } from "../apiutil/api_logging.js";
import { configureAxiosRetry } from "../apiutil/api_retry.js";
import { configureConsistencyHandling } from "../apiutil/api_consistency.js";
import NoTokenFoundError from "../error/NoTokenFoundError.js";

/** Base command class for authenticated commands that includes the --token flag. */
export abstract class BaseCommand extends CoreBaseCommand {
  static baseFlags = {
    token: Flags.string({
      description:
        "API token to use for authentication (overrides environment and config file). NOTE: watch out that tokens passed via this flag might be logged in your shell history.",
      required: false,
      helpGroup: "AUTHENTICATION",
    }),
  };

  public async init(): Promise<void> {
    await super.init();
    // Override the parent's auth behavior to include --token flag support
    if (this.authenticationRequired) {
      const { flags } = await this.parse();
      const token = await this.getEffectiveTokenWithFlag(flags);
      if (token === undefined) {
        throw new NoTokenFoundError(getTokenFilename(this.config));
      }

      this.apiClient = MittwaldAPIV2Client.newWithToken(token);
      this.apiClient.axios.defaults.headers["User-Agent"] =
        `mittwald-cli/${this.config.version}`;

      configureAxiosLogging(this.apiClient.axios);
      configureAxiosRetry(this.apiClient.axios);
      configureConsistencyHandling(this.apiClient.axios);
    }
  }

  private async getEffectiveTokenWithFlag(flags: {
    token?: string;
    [key: string]: unknown;
  }): Promise<string | undefined> {
    // 1. Check --token flag first (highest precedence)
    if (flags.token) {
      return flags.token;
    }
    // 2. Fall back to existing readApiToken logic (env then file)
    return await readApiToken(this.config);
  }
}
