import { ExecRenderBaseCommand } from "../../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Flags, Args } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../../../rendering/react/components/Success.js";
import { Value } from "../../../../rendering/react/components/Value.js";

type Result = {
  mysqlUserId: string;
};

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static description = "Create a new mysql user";
  static args = {
    "database-id": Args.string({
      description: "ID of the MySQL Database to create a user for",
    }),
  };
  static flags = {
    ...processFlags,
    "database-id": Flags.string({
      required: true,
      description: "ID of the MySQL Database to create a user for",
    }),
    "access-level": Flags.string({
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
      "Creating a new mysql User",
    );

    // TODO: implement withMySQLId

    let mysqlDatabaseId: string = "";
    if (this.flags["database-id"]) {
      mysqlDatabaseId = this.flags["database-id"];
    } else if (this.args["database-id"]) {
      mysqlDatabaseId = this.args["database-id"];
    } else {
      await process.error(
        "Please provide a backup schedule id as flag or argument",
      );
    }

    const {
      "access-level": accessLevel,
      description,
      password,
      "access-ip-mask": accessIpMask,
      "external-access": externalAccess,
    } = this.flags;

    const createMysqlUserPayload: {
      accessLevel: "full" | "readonly";
      databaseId: string;
      description: string;
      password: string;
      accessIpMask?: string | undefined;
      externalAccess?: boolean | undefined;
    } = {
      accessLevel: accessLevel == "full" ? "full" : "readonly",
      databaseId: mysqlDatabaseId,
      description,
      password,
    };

    if (password.length < 12) {
      throw new Error(
        "Your chosen password is too short. Please choose a secure password with at least 12 characters.",
      );
    }

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
