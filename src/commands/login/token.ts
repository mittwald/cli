import { Flags, ux } from "@oclif/core";
import { BaseCommand } from "../../BaseCommand.js";
import * as fs from "fs/promises";

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

    await fs.mkdir(this.config.configDir, { recursive: true });
    await fs.writeFile(this.getTokenFilename(), token, "utf-8");

    this.log("token saved to %o", this.getTokenFilename());
  }

  private async tokenFileExists(): Promise<boolean> {
    try {
      await fs.access(this.getTokenFilename());
      return true;
    } catch (err) {
      if (err instanceof Error && "code" in err && err.code === "ENOENT") {
        return false;
      }
      throw err;
    }
  }
}
