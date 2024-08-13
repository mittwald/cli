import { ExecRenderBaseCommand } from "../../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../../../rendering/react/components/Success.js";
import { Value } from "../../../../rendering/react/components/Value.js";
import { withMySQLId } from "../../../../lib/resources/database/mysql/flags.js";

type Result = {
  sftpUserId: string;
};

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static description = "Create a new mysql user";
  static flags = {
    ...processFlags,
    accessLevel: Flags.string({
      required: true,
      description: "Access level for this mysql user",
      options: ["readonly", "full"],
    }),
    description: Flags.string({
      required: true,
      description: "Description of the mysql user",
    }),
    password: Flags.string({
      required: true,
      description: "Password used for authentication",
      exactlyOne: ["public-key", "password"],
    }),
    accessIpMask: Flags.string({
      description: "IP from wich external access will be exclusively allowed",
    }),
    externalAccess: Flags.boolean({
      description: "Enable/Disable external access for this user.",
    }),
  };

  protected async exec(): Promise<Result> {
    const process = makeProcessRenderer(
      this.flags,
      "Creating a new mysql User",
    );
    const mysqlDatabaseId = await withMySQLId(
      this.apiClient,
      this.flags,
      this.args,
    );
    const { accessLevel, description, password, accessIpMask, externalAccess } =
      this.flags;

    const createMysqlUserPayload: {
      accessLevel: "full" | "readonly";
      databaseId: string;
      description: string;
      password: string;
      accessIpMask?: string | undefined;
      externalAccess?: boolean | undefined;
    } = {
      accessLevel,
      databaseId: mysqlDatabaseId,
      description,
      password,
    };

    if (accessIpMask) {
      createMysqlUserPayload.accessIpMask = accessIpMask;
    }

    if (externalAccess) {
      createMysqlUserPayload.externalAccess = true;
    } else if (externalAccess != undefined && !externalAccess) {
      createMysqlUserPayload.externalAccess = false;
    }

    const { id: mysqlUserId } = await process.runStep(
      "creating mysql user",
      async () => {
        const r = await this.apiClient.database.createMysqlUser({
          mysqlDatabaseId,
          data: createMysqlUserPayload,
        });
        assertStatus(r, 201);
        return r.data;
      },
    );

    const mysqlUser = await process.runStep(
      "checking newly created mysql user",
      async () => {
        const r = await this.apiClient.database.getMysqlUser({
          mysqlUserId,
        });
        assertStatus(r, 200);
        return r.data;
      },
    );

    process.complete(
      <Success>
        The mysql user "<Value>{mysqlUser.description}</Value>" was successfully
        created.
      </Success>,
    );

    return { mysqlUserId };
  }

  protected render({ mysqlUserId }: Result): ReactNode {
    if (this.flags.quiet) {
      return mysqlUserId;
    }
  }
}
