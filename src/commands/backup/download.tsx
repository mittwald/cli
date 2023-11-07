import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { ProcessRenderer } from "../../rendering/process/process.js";
import crypto from "crypto";
import { Text } from "ink";
import { Value } from "../../rendering/react/components/Value.js";
import {
  assertStatus,
  AxiosRequestConfig,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from "@mittwald/api-client-commons";
import { waitUntil } from "../../lib/wait.js";
import axios from "axios";
import * as fs from "fs";
import { formatBytes } from "../../lib/viewhelpers/size.js";
import { Success } from "../../rendering/react/components/Success.js";

type Result = { outputFilename: string };

export class Download extends ExecRenderBaseCommand<typeof Download, Result> {
  static description = "Download a backup to your local disk";
  static args = {
    "backup-id": Args.string({
      required: true,
      description: "the ID of the Backup to download.",
    }),
  };
  static flags = {
    ...processFlags,
    output: Flags.string({
      description:
        "the file to write the backup to; if omitted, the filename will be determined by the server.",
    }),
    format: Flags.string({
      description: "the file format to download the backup in.",
      options: ["tar", "zip"],
      default: "tar",
    }),
    password: Flags.string({
      summary: "the password to encrypt the backup with.",
      description: `\
        CAUTION #1: this is not stored anywhere.
        CAUTION #2: it is dangerous to use this option, as the password might be stored in your shell history.`,
      exclusive: ["generate-password", "prompt-password"],
    }),
    "generate-password": Flags.boolean({
      summary: "generate a random password to encrypt the backup with.",
      description: "CAUTION: this is not stored anywhere.",
      exclusive: ["password", "prompt-password"],
    }),
    "prompt-password": Flags.boolean({
      summary: "prompt for a password to encrypt the backup with.",
      description: "CAUTION: this is not stored anywhere.",
      exclusive: ["password", "generate-password"],
    }),
    resume: Flags.boolean({
      summary: "resume a previously interrupted download.",
      dependsOn: ["output"],
    }),
  };
  static aliases = ["project:backup:download"];
  static deprecateAliases = true;

  protected async getPassword(p: ProcessRenderer): Promise<string | undefined> {
    if (this.flags.password) {
      return this.flags.password;
    }

    if (this.flags["generate-password"]) {
      const password = await p.runStep("generating password", async () => {
        return crypto.randomBytes(32).toString("ascii").substring(0, 32);
      });
      p.addInfo(
        <Text>
          generated password: <Value>{password}</Value>
        </Text>,
      );
      return password;
    }

    if (this.flags["prompt-password"]) {
      return await p.addInput(<Text>enter backup password</Text>, true);
    }

    return undefined;
  }

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Downloading backup");
    const projectBackupId = this.args["backup-id"];
    const { format } = this.flags;
    const password = await this.getPassword(p);

    const backup = await p.runStep("fetching backup", async () => {
      const r = await this.apiClient.backup.getProjectBackup({
        projectBackupId,
      });
      assertStatus(r, 200);
      return r.data;
    });

    if (backup.export && backup.export.phase !== "Expired") {
      p.addInfo(<Text>backup download is already prepared</Text>);
    } else {
      await p.runStep("preparing backup download", async () => {
        const r = await this.apiClient.backup.createProjectBackupExport({
          projectBackupId,
          data: {
            format: format as "tar" | "zip",
            password,
          },
        });

        assertStatus(r, 204);
      });
    }

    const backupExport = await p.runStep(
      "waiting for backup download to be ready",
      () => {
        return waitUntil(async () => {
          const r = await this.apiClient.backup.getProjectBackup({
            projectBackupId,
          });
          assertStatus(r, 200);

          if (r.data.export?.phase === "Completed") {
            return r.data.export;
          }

          return null;
        }, 3600);
      },
    );

    if (!backupExport.downloadURL) {
      throw new Error("backup download is not ready");
    }

    const reqConfig: AxiosRequestConfig = { responseType: "stream" };
    if (
      this.flags.resume &&
      this.flags.output &&
      fs.existsSync(this.flags.output)
    ) {
      const stat = fs.statSync(this.flags.output);
      const range = `bytes=${stat.size}-`;

      reqConfig.headers = { Range: range };

      p.addInfo(
        <Text>
          resuming download starting at <Value>{stat.size}</Value> bytes
        </Text>,
      );
    }

    const downloadStep = p.addStep("downloading backup");
    const resp = await axios(backupExport.downloadURL, reqConfig);
    const size = parseInt(resp.headers["content-length"] || "0", 10);
    let downloaded = 0;

    const outputFilename = this.getFilename(resp.headers);
    const outputStream = fs.createWriteStream(outputFilename, {
      flags: this.flags.resume ? "a" : undefined,
    });

    resp.data.on("data", (chunk: { length: number }) => {
      downloaded += chunk.length;
      downloadStep.progress(
        formatBytes(downloaded, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) +
          " of " +
          formatBytes(size, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
      );
      outputStream.write(chunk);
    });

    await new Promise<void>((res) => {
      resp.data.on("end", () => {
        downloadStep.complete();
        res();
      });
      resp.data.on("error", (err: unknown) => {
        downloadStep.error(err);
        res();
      });
    });

    p.complete(
      <Success>
        The backup was successfully downloaded to{" "}
        <Value>{outputFilename}</Value>
      </Success>,
    );

    return { outputFilename };
  }

  protected getFilename(
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders,
  ): string {
    if (this.flags.output) {
      return this.flags.output;
    }

    const disposition = headers["content-disposition"];
    if (disposition) {
      const match = disposition.match(/filename=("?)(.*)\1/);
      if (match) {
        return match[2];
      }
    }

    if (this.flags.format === "tar") {
      return "backup.tar.gz";
    }
    return "backup.zip";
  }

  protected render(executionResult: Result): ReactNode {
    if (this.flags.quiet) {
      return executionResult.outputFilename;
    }
    return undefined;
  }
}
