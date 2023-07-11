import * as fs from "fs/promises";
import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import React from "react";
import { Text } from "ink";
import { Note } from "../../rendering/react/components/Note.js";

type ResetResult = { deleted: boolean };

export default class Reset extends ExecRenderBaseCommand<
  typeof Reset,
  ResetResult
> {
  static description = "Reset your local authentication state";
  protected authenticationRequired = false;

  protected async exec(): Promise<ResetResult> {
    if (await this.tokenFileExists()) {
      await fs.rm(this.getTokenFilename(), { force: true });
      return { deleted: true };
    }

    return { deleted: false };
  }

  protected render({ deleted }: ResetResult): React.ReactNode {
    if (deleted) {
      return (
        <>
          <Text>token deleted from {this.getTokenFilename()}</Text>
          <Note>
            Please keep in mind that this does not invalidate the token on the
            server. Invalidate your API token using the mStudio web interface,
            or using the 'mw user api-token revoke' command.
          </Note>
        </>
      );
    }

    return <Text>no token found at {this.getTokenFilename()}</Text>;
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
