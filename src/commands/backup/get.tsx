import { RenderBaseCommand } from "../../lib/basecommands/RenderBaseCommand.js";
import { ReactNode } from "react";
import { useProjectBackup } from "../../lib/resources/projectbackup/hooks.js";
import { ProjectBackupDetails } from "../../rendering/react/components/ProjectBackup/ProjectBackupDetails.js";
import { RenderJson } from "../../rendering/react/json/RenderJson.js";
import { GetBaseCommand } from "../../lib/basecommands/GetBaseCommand.js";
import { Box } from "ink";
import { backupArgs, withBackupId } from "../../lib/resources/backup/flags.js";
import { usePromise } from "@mittwald/react-use-promise";

export default class Get extends RenderBaseCommand<typeof Get> {
  static description = "Show details of a backup.";
  static args = { ...backupArgs };
  static flags = {
    ...RenderBaseCommand.buildFlags(),
  };
  static aliases = ["project:backup:get"];
  static deprecateAliases = true;

  protected render(): ReactNode {
    const backupId = usePromise(
      () =>
        withBackupId(this.apiClient, Get, this.flags, this.args, this.config),
      [],
    );
    const projectBackup = useProjectBackup(backupId);

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
