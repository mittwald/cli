import { Flags } from "@oclif/core";
import * as fs from "fs/promises";
import { getTokenFilename } from "../../lib/auth/token.js";

import { isNotFound } from "../../lib/util/fs/isNotFound.js";
import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { makeProcessRenderer, processFlags } from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import { Filename } from "../../rendering/react/components/Filename.js";
import { ReactNode } from "react";

export default class Token extends ExecRenderBaseCommand<typeof Token, string> {
  static description = "Authenticate using an API token";
  static flags = {
    ...processFlags,
    overwrite: Flags.boolean({
      char: "o",
      description: "overwrite existing token file",
    }),
  };
  authenticationRequired = false;

  public async exec(): Promise<string> {
    const r = makeProcessRenderer(this.flags, "Authenticating with API token");
    const tokenFilename = getTokenFilename(this.config);

    if ((await this.tokenFileExists()) && !this.flags.overwrite) {
      const confirmed = await r.addConfirmation("Token file already exists. Overwrite?");
      if (!confirmed) {
        throw new Error(`cancelling authentication; token file already exists at ${tokenFilename}`);
      }
    }

    const token = await r.addInput("Enter your mStudio API token", true);

    await fs.mkdir(this.config.configDir, { recursive: true });
    await fs.writeFile(tokenFilename, token, "utf-8");

    return tokenFilename;
  }

  protected render(tokenFilename: string): ReactNode {
    return <Success>Token file saved at <Filename filename={tokenFilename} /></Success>;
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
