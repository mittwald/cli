import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  mysqlArgs,
  withMySQLId,
} from "../../../lib/resources/database/mysql/flags.js";
import {
  getUpgradeCandidatesForVersion,
  compareVersions,
} from "../../../lib/resources/database/mysql/versions.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import { Success } from "../../../rendering/react/components/Success.js";
import { Value } from "../../../rendering/react/components/Value.js";
import { waitFlags, waitUntil } from "../../../lib/wait.js";
import { Flags, ux } from "@oclif/core";
import { Text } from "ink";
import { ReactNode } from "react";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";

type Database = MittwaldAPIV2.Components.Schemas.DatabaseMySqlDatabase;
type MySqlVersion = MittwaldAPIV2.Components.Schemas.DatabaseMySqlVersion;

export class Upgrade extends ExecRenderBaseCommand<typeof Upgrade, void> {
  static summary = "Upgrade a MySQL database to a newer version";
  static description = `\
MySQL does not support downgrades, so only versions newer than the one the database is currently running can be selected. If the target version is omitted, it will be prompted for interactively.

Upgrading a database is disruptive; the database will be unavailable while the upgrade is running. Consider creating a backup ("mw backup create") before upgrading.`;

  static args = { ...mysqlArgs };
  static flags = {
    version: Flags.string({
      summary: "the MySQL version to upgrade to",
      description:
        'Use the "database mysql versions" command to list available versions. If set to "latest", the most recent version available for this database will be used.',
    }),
    force: Flags.boolean({
      char: "f",
      summary: "do not ask for confirmation",
    }),
    ...processFlags,
    ...waitFlags,
  };

  static examples = [
    {
      description: "Upgrade a database to a specific version",
      command:
        "<%= config.bin %> database mysql upgrade <database-id> --version 8.0",
    },
    {
      description:
        "Upgrade a database to the latest available version, and wait for the upgrade to complete",
      command:
        "<%= config.bin %> database mysql upgrade <database-id> --version latest --wait",
    },
  ];

  protected async exec(): Promise<void> {
    const p = makeProcessRenderer(this.flags, "Upgrading a MySQL database");
    const mysqlDatabaseId = await withMySQLId(
      this.apiClient,
      this.flags,
      this.args,
    );

    const database = await p.runStep("fetching database", async () => {
      const response = await this.apiClient.database.getMysqlDatabase({
        mysqlDatabaseId,
      });
      assertStatus(response, 200);
      return response.data;
    });

    const candidates = await p.runStep("fetching available versions", () =>
      getUpgradeCandidatesForVersion(this.apiClient, database.version),
    );

    if (candidates.length === 0) {
      await p.complete(
        <Text>
          The database <Value>{database.name}</Value> already runs the latest
          available version (<Value>{database.version}</Value>). ✅
        </Text>,
      );
      return;
    }

    const targetVersion = await this.determineTargetVersion(p, candidates);

    if (!this.flags.force) {
      const confirmed = await p.addConfirmation(
        `Confirm upgrading ${database.name} (${database.description}) from version ${database.version} to ${targetVersion.number}`,
      );

      if (!confirmed) {
        p.addInfo("Upgrade will not be triggered.");
        await p.complete(<></>);
        ux.exit(1);
      }
    }

    await p.runStep("triggering upgrade", async () => {
      const response = await this.apiClient.database.patchMysqlDatabase({
        mysqlDatabaseId,
        data: { version: targetVersion.number },
      });
      assertStatus(response, 204);
    });

    if (this.flags.wait) {
      await this.waitUntilUpgraded(p, mysqlDatabaseId, targetVersion);
      await p.complete(
        <Success>
          The database <Value>{database.name}</Value> was upgraded to version{" "}
          <Value>{targetVersion.number}</Value>.
        </Success>,
      );
      return;
    }

    await p.complete(
      <Success>
        The upgrade of <Value>{database.name}</Value> to version{" "}
        <Value>{targetVersion.number}</Value> has been started.
      </Success>,
    );
  }

  private async determineTargetVersion(
    p: ProcessRenderer,
    candidates: MySqlVersion[],
  ): Promise<MySqlVersion> {
    const requested = this.flags.version;

    if (requested === "latest") {
      return candidates.sort(compareVersions)[candidates.length - 1];
    }

    if (requested) {
      const match = candidates.find((c) => c.number === requested);
      if (match) {
        return match;
      }

      p.error(
        new Error(
          `"${requested}" is not a valid upgrade target for this database; available versions are: ${candidates
            .map((c) => c.number)
            .join(", ")}`,
        ),
      );
      ux.exit(1);
    }

    return await p.addSelect(
      "Please select the version to upgrade to",
      candidates.map((c) => ({ value: c, label: c.number })),
    );
  }

  /**
   * The API reports a single `version` field rather than a current/desired
   * pair, so the upgrade is considered done once the database reports the
   * target version and has left the transitional states.
   */
  private async waitUntilUpgraded(
    p: ProcessRenderer,
    mysqlDatabaseId: string,
    targetVersion: MySqlVersion,
  ): Promise<void> {
    const step = p.addStep("waiting for the upgrade to complete");

    await waitUntil<Database>(async () => {
      const response = await this.apiClient.database.getMysqlDatabase({
        mysqlDatabaseId,
      });

      if (
        response.status === 200 &&
        response.data.version === targetVersion.number &&
        response.data.status === "ready" &&
        response.data.isReady
      ) {
        return response.data;
      }

      return null;
    }, this.flags["wait-timeout"]);

    step.complete();
  }

  protected render(): ReactNode {
    return true;
  }
}
