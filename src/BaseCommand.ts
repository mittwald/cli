import { Command } from "@oclif/core";
import * as fs from "fs/promises";
import * as path from "path";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { configureAxiosRetry } from "./lib/api_retry.js";
import { configureConsistencyHandling } from "./lib/api_consistency.js";

export abstract class BaseCommand extends Command {
  protected authenticationRequired = true;
  protected apiClient: MittwaldAPIV2Client =
    MittwaldAPIV2Client.newUnauthenticated();

  public async init(): Promise<void> {
    await super.init();
    if (this.authenticationRequired) {
      const token = await this.readApiToken();
      if (token === undefined) {
        throw new Error(
          `Could not get token from either config file (${this.getTokenFilename()}) or environment`,
        );
      }

      this.apiClient = MittwaldAPIV2Client.newWithToken(token);
      this.apiClient.axios.defaults.headers["User-Agent"] =
        `mittwald-cli/${this.config.version}`;

      configureAxiosRetry(this.apiClient.axios);
      configureConsistencyHandling(this.apiClient.axios);
    }
  }

  protected getTokenFilename(): string {
    return path.join(this.config.configDir, "token");
  }

  private async readApiToken(): Promise<string | undefined> {
    return (
      this.readApiTokenFromEnvironment() ??
      (await this.readApiTokenFromConfig())
    );
  }

  private readApiTokenFromEnvironment(): string | undefined {
    const token = process.env.MITTWALD_API_TOKEN;
    if (token === undefined) {
      return undefined;
    }
    return token.trim();
  }

  private async readApiTokenFromConfig(): Promise<string | undefined> {
    try {
      const tokenFileContents = await fs.readFile(
        this.getTokenFilename(),
        "utf-8",
      );
      return tokenFileContents.trim();
    } catch (err) {
      if (err instanceof Error && "code" in err && err.code === "ENOENT") {
        return undefined;
      }

      throw err;
    }
  }
}
