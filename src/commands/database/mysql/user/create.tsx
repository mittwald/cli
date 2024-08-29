import { ExecRenderBaseCommand } from "../../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../../../rendering/react/components/Success.js";
import { Value } from "../../../../rendering/react/components/Value.js";
import type { MittwaldAPIV2Client } from "@mittwald/api-client";
import { mysqlUserFlagDefinitions } from "../../../../lib/resources/database/mysql/user/flags.js";

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
    "database-id": mysqlUserFlagDefinitions["database-id"]({ required: true }),
    "access-level": mysqlUserFlagDefinitions["access-level"]({
      required: true,
    }),
    description: mysqlUserFlagDefinitions.description({ required: true }),
    password: mysqlUserFlagDefinitions.password({ required: true }),
    "access-ip-mask": mysqlUserFlagDefinitions["access-ip-mask"](),
    "external-access": mysqlUserFlagDefinitions["external-access"](),
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

    await process.complete(
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
