import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../lib/basecommands/GetBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import { BaseCommand } from "../../../lib/basecommands/BaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import * as cp from "child_process";
import * as fs from "fs";
import tempfile from "tempfile";

export type PathParams =
  MittwaldAPIV2.Paths.V2CronjobsCronjobIdExecutionsExecutionId.Get.Parameters.Path;

export class Logs extends BaseCommand {
  static summary = "Get the log output of a cronjob execution.";
  static description =
    "This command prints the log output of a cronjob execution. " +
    "" +
    'When this command is run in a terminal, the output is piped through a pager. The pager is determined by your PAGER environment variable, with defaulting to "less". You can disable this behavior with the --no-pager flag.';

  static aliases = ["project:cronjob:execution:logs"];
  static deprecateAliases = true;

  static flags = {
    ...GetBaseCommand.baseFlags,
    "no-pager": Flags.boolean({
      description: "Disable pager for output.",
    }),
  };
  static args = {
    "cronjob-id": Args.string({
      description: "ID of the cronjob the execution belongs to",
      required: true,
    }),
    "execution-id": Args.string({
      description: "ID of the cronjob execution to be retrieved.",
      required: true,
    }),
  };

  public async run(): Promise<void> {
    const { flags, args } = await this.parse(Logs);

    const cronjobId = args["cronjob-id"];
    const executionId = args["execution-id"];
    const usePager = process.stdin.isTTY && !flags["no-pager"];

    const cronJob = await this.apiClient.cronjob.getCronjob({
      cronjobId,
    });
    const execution = await this.apiClient.cronjob.getExecution({
      cronjobId,
      executionId,
    });

    assertStatus(cronJob, 200);
    assertStatus(execution, 200);

    const projectId = cronJob.data.projectId;
    if (!projectId) {
      throw new Error("Cronjob has no project ID");
    }

    // TODO: Replace this with a call to the actual "getFileContent" method,
    // once we support passing the required query parameters.
    const response = await this.apiClient.axios.get(
      `/v2/projects/${projectId}/filesystem/files/raw`,
      {
        params: {
          file: execution.data.logPath,
          inline: "true",
        },
      },
    );

    // await this.apiClient.projectFileSystem.getFileContent({
    //    projectId ,
    //   queryParameters: { file: execution.data.logPath, inline: true },
    // });

    if (usePager) {
      const t = tempfile();

      try {
        fs.writeFileSync(t, response.data);
        cp.spawnSync(process.env.PAGER || "less", [t], {
          stdio: "inherit",
        });
      } finally {
        fs.unlinkSync(t);
      }
    } else {
      this.log(response.data);
    }
  }
}
