import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/react/process_flags.js";
import { assertStatus } from "@mittwald/api-client-commons";
import * as cp from "child_process";
import { Text } from "ink";
import { Value } from "../../../rendering/react/components/Value.js";
import * as fs from "fs";
import { Success } from "../../../rendering/react/components/Success.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { ProcessRenderer } from "../../../rendering/react/process.js";
import DatabaseMySqlDatabase = MittwaldAPIV2.Components.Schemas.DatabaseMySqlDatabase;
import DatabaseMySqlUser = MittwaldAPIV2.Components.Schemas.DatabaseMySqlUser;
import SignupAccount = MittwaldAPIV2.Components.Schemas.SignupAccount;
import ProjectProject = MittwaldAPIV2.Components.Schemas.ProjectProject;

export class Dump extends ExecRenderBaseCommand<typeof Dump, any> {
  static summary = "Create a dump of a MySQL database";
  static flags = {
    ...processFlags,
    "mysql-password": Flags.string({
      char: "p",
      summary: "the password to use for the MySQL user (env: MYSQL_PWD)",
      description: `\
The password to use for the MySQL user. If not provided, the environment variable MYSQL_PWD will be used.

NOTE: This is a security risk, as the password will be visible in the process list of your system, and will be visible in your Shell history. It is recommended to use the environment variable instead.\
      `,
      required: true,
      env: "MYSQL_PWD",
    }),
    output: Flags.string({
      char: "o",
      summary: 'the output file to write the dump to ("-" for stdout)',
      description: `\
        The output file to write the dump to. You can specify "-" or "/dev/stdout" to write the dump directly to STDOUT; in this case, you might want to use the --quiet/-q flag to supress all other output, so that you can pipe the mysqldump for further processing.`,
      required: true,
    }),
  };
  static args = {
    "database-id": Args.string({
      description: "The ID of the database to dump",
      required: true,
    }),
  };

  protected async exec(): Promise<void> {
    const databaseId = this.args["database-id"];
    const p = makeProcessRenderer(this.flags, "Dumping a MySQL database");

    const database = await this.getDatabase(p, databaseId);
    const databaseUser = await this.getDatabaseUser(p, databaseId);
    const project = await this.getProject(p, database);
    const user = await this.getUser(p);

    const sshHost = `ssh.${project.clusterID}.${project.clusterDomain}`;
    const sshUser = `${user.email}@${project.shortId}`;
    const sshArgs = [
      "-l",
      sshUser,
      "-T",
      sshHost,
      "mysqldump",
      "-h",
      database.hostname,
      "-u",
      databaseUser.name,
      "-p" + this.flags["mysql-password"],
      database.name,
    ];

    const stream = fs.createWriteStream(this.flags.output);
    await p.runStep(
      <Text>
        starting mysqldump via SSH on <Value>{sshHost}</Value> as{" "}
        <Value>{sshUser}</Value>
      </Text>,
      () => {
        const ssh = cp.spawn("ssh", sshArgs, {
          stdio: ["ignore", "pipe", "pipe"],
        });

        let err = "";

        ssh.stdout.pipe(stream);
        ssh.stderr.on("data", (data) => {
          err += data.toString();
        });

        return new Promise((res, rej) => {
          ssh.on("exit", (code) => {
            stream.close();
            if (code === 0) {
              res(undefined);
            } else {
              rej(new Error(`ssh+mysqldump exited with code ${code}\n${err}`));
            }
          });
        });
      },
    );

    p.complete(
      <Success>
        Dump of MySQL database <Value>{database.name}</Value> written to{" "}
        <Value>{this.flags.output}</Value>
      </Success>,
    );
  }

  private async getDatabase(
    p: ProcessRenderer,
    id: string,
  ): Promise<DatabaseMySqlDatabase> {
    return await p.runStep("fetching database", async () => {
      const r = await this.apiClient.database.getMysqlDatabase({
        pathParameters: { id },
      });
      assertStatus(r, 200);

      return r.data;
    });
  }

  private async getDatabaseUser(
    p: ProcessRenderer,
    databaseId: string,
  ): Promise<DatabaseMySqlUser> {
    return await p.runStep("fetching main user", async () => {
      const r = await this.apiClient.database.listMysqlUsers({
        pathParameters: { databaseId },
      });
      assertStatus(r, 200);

      const mainUser = r.data.find((u) => u.mainUser);
      if (!mainUser) {
        throw new Error("No main user found");
      }

      return mainUser;
    });
  }

  private async getUser(p: ProcessRenderer): Promise<SignupAccount> {
    return await p.runStep("fetching user", async () => {
      const r = await this.apiClient.user.getOwnAccount();
      assertStatus(r, 200);

      return r.data;
    });
  }

  private async getProject(
    p: ProcessRenderer,
    database: DatabaseMySqlDatabase,
  ): Promise<ProjectProject> {
    return await p.runStep("fetching project", async () => {
      const r = await this.apiClient.project.getProject({
        pathParameters: { id: database.projectId },
      });
      assertStatus(r, 200);

      return r.data;
    });
  }

  protected render(executionResult: any): ReactNode {
    return undefined;
  }
}
