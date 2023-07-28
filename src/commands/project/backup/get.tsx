import { RenderBaseCommand } from "../../../rendering/react/RenderBaseCommand.js";
import { ReactNode } from "react";
import { useProjectBackup } from "../../../lib/projectbackup/hooks.js";
import { Args } from "@oclif/core";
import { ProjectBackupDetails } from "../../../rendering/react/components/ProjectBackup/ProjectBackupDetails.js";
import { RenderJson } from "../../../rendering/react/json/RenderJson.js";
import { GetBaseCommand } from "../../../GetBaseCommand.js";
import { Box } from "ink";

export default class Get extends RenderBaseCommand<typeof Get> {
  static description = "show details of a backup.";
  static args = {
    "backup-id": Args.string({
      required: true,
      description: "The ID of the Backup to show.",
    }),
  };
  static flags = {
    ...GetBaseCommand.baseFlags,
  };

  protected render(): ReactNode {
    const projectBackup = useProjectBackup(this.args["backup-id"]);

    if (this.flags.output === "json") {
      return <RenderJson name="projectBackup" data={projectBackup} />;
    }

    return (
      <Box marginBottom={1}>
        <ProjectBackupDetails projectBackup={projectBackup} />
      </Box>
    );
  }
}
