import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { mysqlArgs, withMySQLId } from "../../../lib/database/mysql/flags.js";
import { Flags } from "@oclif/core";
import { randomBytes } from "crypto";
import { assertStatus } from "@mittwald/api-client";
import cp from "child_process";
import { assertSuccess } from "../../../lib/assert_success.js";
import { Success } from "../../../rendering/react/components/Success.js";
import { Value } from "../../../rendering/react/components/Value.js";
import * as fs from "fs";
import React from "react";
import { getConnectionDetailsWithPassword } from "../../../lib/database/mysql/connect.js";

export class Export extends ExecRenderBaseCommand<typeof Export, void> {
  static summary = "Create a dump of a MySQL database";
  static flags = {
    ...processFlags,
    output: Flags.string({
      char: "o",
      summary: 'the output file to write the dump to ("-" for stdout)',
      description:
        'The output file to write the dump to. You can specify "-" or "/dev/stdout" to write the dump directly to STDOUT; in this case, you might want to use the --quiet/-q flag to supress all other output, so that you can pipe the mysqldump for further processing.',
      required: true,
      default: undefined,
    }),
  };
  static args = { ...mysqlArgs };

  protected async exec(): Promise<void> {
    const mysqlDatabaseId = await withMySQLId(
      this.apiClient,
      this.flags,
      this.args,
      this.config,
    );
    const p = makeProcessRenderer(this.flags, "Dumping a MySQL database");

    const password = randomBytes(32).toString("base64");

    const database = await p.runStep("Retrieve database", async () => {
      const r = await this.apiClient.database.getMysqlDatabase({
        mysqlDatabaseId,
      });
      assertStatus(r, 200);

      return r.data;
    });

    const project = await p.runStep("Retrieve project", async () => {
      const r = await this.apiClient.project.getProject({
        projectId: database.projectId,
      });
      assertStatus(r, 200);

      return r.data;
    });

    const { id: mysqlUserId } = await p.runStep(
      "Creating a temporary database user",
      async () => {
        const r = await this.apiClient.database.createMysqlUser({
          mysqlDatabaseId,
          data: {
            accessLevel: "readonly",
            externalAccess: true,
            password,
            databaseId: mysqlDatabaseId,
            description: "Temporary user for exporting database",
          },
        });

        assertStatus(r, 201);
        return r.data;
      },
    );

    const user = await p.runStep("Retrieve database user", async () => {
      const r = await this.apiClient.database.getMysqlUser({ mysqlUserId });
      assertStatus(r, 200);

      return r.data;
    });

    const hostname = `mysql.${project.clusterID}.mittwald.cloud`;

    const stream = fs.createWriteStream(this.flags.output);
    await p.runStep("Exporting database", async () => {
      const mysqldumpArgs = ["-h", hostname, "-u", user.name, database.name];
      const mysqldump = cp.spawn("mysqldump", mysqldumpArgs, {
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, MYSQL_PWD: password },
      });

      console.log(password);
      console.log(mysqldumpArgs);

      let err = "";

      mysqldump.stdout.pipe(stream);
      mysqldump.stderr.on("data", (data) => {
        err += data.toString();
      });

      return new Promise((res, rej) => {
        mysqldump.on("exit", (code) => {
          stream.close();
          if (code === 0) {
            res(undefined);
          } else {
            rej(new Error(`mysqldump exited with code ${code}\n${err}`));
          }
        });
      });
    });

    await p.runStep("Deleting temporary database user", async () => {
      const r = await this.apiClient.database.deleteMysqlUser({ mysqlUserId });
      assertSuccess(r);
    });

    p.complete(
      <Success>
        Dump of MySQL database <Value>{database.name}</Value> written to{" "}
        <Value>{this.flags.output}</Value>
      </Success>,
    );
  }

  protected render(): React.ReactNode {
    return undefined;
  }
}
