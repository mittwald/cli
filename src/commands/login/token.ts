import { Flags, ux } from "@oclif/core";
import { BaseCommand } from "../../lib/basecommands/BaseCommand.js";
import * as fs from "fs/promises";
import { getTokenFilename } from "../../lib/auth/token.js";
import { isNotFound } from "../../lib/fsutil.js";

export default class Token extends BaseCommand {
  static description = "Authenticate using an API token";
  static flags = {
    overwrite: Flags.boolean({
      char: "o",
      description: "overwrite existing token file",
    }),
  };
  authenticationRequired = false;

  public async run(): Promise<void> {
    const { flags } = await this.parse(Token);

    if ((await this.tokenFileExists()) && !flags.overwrite) {
      const confirmed = await ux.confirm(
        "Token file already exists. Overwrite?",
      );
      if (!confirmed) {
        return;
      }
    }

    const token = await ux.prompt("Enter your mStudio API token", {
      type: "mask",
    });

    const tokenFilename = getTokenFilename(this.config);

    await fs.mkdir(this.config.configDir, { recursive: true });
    await fs.writeFile(tokenFilename, token, "utf-8");

    this.log("token saved to %o", tokenFilename);
  }

  private async tokenFileExists(): Promise<boolean> {
    try {
      await fs.access(getTokenFilename(this.config));
      return true;
    } catch (err) {
      if (isNotFound(err)) {
        return false;
      }
      throw err;
    }
  }
}
