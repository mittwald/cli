import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../../rendering/react/components/Success.js";
import { Value } from "../../../rendering/react/components/Value.js";

type Result = {
  databaseId: string;
};

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static summary = "Create a new Redis database";
  static flags = {
    ...projectFlags,
    ...processFlags,
    description: Flags.string({
      char: "d",
      summary: "a description for the database",
      required: true,
    }),
    version: Flags.string({
      summary: "the Redis version to use",
      description:
        'Use the "database redis versions" command to list available versions',
      required: true,
    }),
    persistent: Flags.boolean({
      summary: "enable persistent storage for the Redis database",
      allowNo: true,
      default: true,
    }),
    "max-memory": Flags.string({
      summary: "the maximum memory for the Redis database",
      description:
        'This specifies the maximum memory; you should provide a number, followed by one of the IEC suffixes, like "Ki", "Mi" or "Gi"',
    }),
    "max-memory-policy": Flags.string({
      summary: "the Redis eviction policy",
      description:
        "See https://redis.io/docs/reference/eviction/#eviction-policies for details",
      options: [
        "noeviction",
        "allkeys-lru",
        "allkeys-lfu",
        "volatile-lru",
        "volatile-lfu",
        "allkeys-random",
        "volatile-random",
        "volatile-ttl",
      ],
    }),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Creating a new Redis database");
    const projectId = await withProjectId(
      this.apiClient,
      Create,
      this.flags,
      this.args,
      this.config,
    );

    const {
      description,
      version,
      "max-memory": maxMemory,
      "max-memory-policy": maxMemoryPolicy,
      persistent,
    } = this.flags;

    const db = await p.runStep("creating Redis database", async () => {
      const r = await this.apiClient.database.createRedisDatabase({
        pathParameters: { projectId },
        data: {
          description,
          version,
          configuration: {
            maxMemory,
            maxMemoryPolicy,
            persistent,
          },
        },
      });

      assertStatus(r, 201);
      return r.data;
    });

    const database = await p.runStep("fetching database", async () => {
      const r = await this.apiClient.database.getRedisDatabase({
        pathParameters: { id: db.id },
      });
      assertStatus(r, 200);

      return r.data;
    });

    p.complete(
      <Success>
        The database <Value>{database.name}</Value> was successfully created.
      </Success>,
    );

    return { databaseId: db.id };
  }

  protected render({ databaseId }: Result): ReactNode {
    if (this.flags.quiet) {
      return databaseId;
    }
  }
}
