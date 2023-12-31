import * as fs from "fs/promises";
import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import React from "react";
import { Box, Text } from "ink";
import { Note } from "../../rendering/react/components/Note.js";
import { FancyProcessRenderer } from "../../rendering/process/process_fancy.js";
import { Filename } from "../../rendering/react/components/Filename.js";

type ResetResult = { deleted: boolean };

export default class Reset extends ExecRenderBaseCommand<
  typeof Reset,
  ResetResult
> {
  static description = "Reset your local authentication state";
  protected authenticationRequired = false;

  protected async exec(): Promise<ResetResult> {
    const process = new FancyProcessRenderer("Resetting authentication state");

    process.start();

    if (await this.tokenFileExists()) {
      const step = process.addStep(
        <Text>
          Deleting token file <Filename filename={this.getTokenFilename()} />
        </Text>,
      );
      await fs.rm(this.getTokenFilename(), { force: true });
      step.complete();

      process.complete(
        <Box flexDirection="column">
          <Text>Authentication state successfully reset</Text>
          <Note>
            Please keep in mind that this does not invalidate the token on the
            server. Invalidate your API token using the mStudio web interface,
            or using the 'mw user api-token revoke' command.
          </Note>
        </Box>,
      );

      return { deleted: true };
    }

    process.complete(<Text>No token file found, nothing to do</Text>);

    return { deleted: false };
  }

  protected render() {
    return null;
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
