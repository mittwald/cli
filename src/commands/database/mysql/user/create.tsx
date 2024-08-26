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
import type { MittwaldAPIV2Client } from "@mittwald/api-client";

type Result = {
  mysqlUserId: string;
};

type MyQSLUserCreationData = Parameters<
  MittwaldAPIV2Client["database"]["createMysqlUser"]
>[0]["data"];

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static description = "Create a new MySQL user";
  static flags = {
    ...processFlags,
    "database-id": Flags.string({
      required: true,
      description: "ID of the MySQL Database to create a user for",
    }),
    "access-level": Flags.string({
      required: true,
      description: "Access level for this MySQL user",
      options: ["readonly", "full"],
    }),
    description: Flags.string({
      required: true,
      description: "Description of the MySQL user",
    }),
    password: Flags.string({
      required: true,
      description: "Password used for authentication",
      exactlyOne: ["public-key", "password"],
    }),
    "access-ip-mask": Flags.string({
      description: "IP from wich external access will be exclusively allowed",
    }),
    "external-access": Flags.boolean({
      description: "Enable/Disable external access for this user.",
    }),
  };

  protected async exec(): Promise<Result> {
    const process = makeProcessRenderer(
      this.flags,
      "Creating a new MySQL User",
    );

    const {
      "database-id": mysqlDatabaseId,
      "access-level": accessLevel,
      description,
      password,
      "access-ip-mask": accessIpMask,
      "external-access": externalAccess,
    } = this.flags;

    const createMysqlUserPayload: MyQSLUserCreationData = {
      accessLevel: accessLevel == "full" ? "full" : "readonly",
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
      "creating MySQL user",
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
      "checking newly created MySQL user",
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
