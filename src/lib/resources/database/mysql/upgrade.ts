import { MittwaldAPIV2 } from "@mittwald/api-client";

type Database = MittwaldAPIV2.Components.Schemas.DatabaseMySqlDatabase;

/**
 * Determines whether an upgrade triggered by patching the database's version
 * has finished.
 *
 * `version` holds the _desired_ version and is updated as soon as the patch is
 * accepted, so it does not indicate that the upgrade has finished. The status
 * also still reads "ready" for a moment after patching, which means waiting for
 * "ready" alone would return before the upgrade even starts.
 *
 * `statusSetAt` records when the status was last set, so requiring it to differ
 * from the value observed before patching proves the database has changed state
 * at least once since. Both timestamps come from the API, so comparing them is
 * not affected by clock skew on the client.
 */
export function isUpgradeComplete(
  database: Database,
  targetVersion: string,
  statusSetAtBeforeUpgrade: string,
): boolean {
  return (
    database.statusSetAt !== statusSetAtBeforeUpgrade &&
    database.version === targetVersion &&
    database.status === "ready" &&
    database.isReady
  );
}
