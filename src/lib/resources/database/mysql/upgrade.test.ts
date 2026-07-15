import { describe, expect, it } from "@jest/globals";
import { isUpgradeComplete } from "./upgrade.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";

type Database = MittwaldAPIV2.Components.Schemas.DatabaseMySqlDatabase;
type DatabaseStatus = MittwaldAPIV2.Components.Schemas.DatabaseDatabaseStatus;

const statusSetAtBefore = "2024-01-01T00:00:00Z";

function database(overrides: {
  version: string;
  status: DatabaseStatus;
  statusSetAt: string;
}): Database {
  return {
    id: "83e0cb85-dcf7-4968-8646-87a63980ae91",
    name: "mysql_demo",
    description: "Demo DB",
    projectId: "p1",
    isReady: overrides.status === "ready",
    isShared: false,
    hostname: "h",
    externalHostname: "eh",
    createdAt: statusSetAtBefore,
    updatedAt: statusSetAtBefore,
    storageUsageInBytes: 1,
    storageUsageInBytesSetAt: statusSetAtBefore,
    characterSettings: {
      characterSet: "utf8mb4",
      collation: "utf8mb4_unicode_ci",
    },
    ...overrides,
  };
}

describe("isUpgradeComplete", () => {
  it("is not complete while the status still reflects the state from before the upgrade", () => {
    // The API updates `version` to the desired value as soon as the patch is
    // accepted, while the status briefly still reads "ready" from before the
    // upgrade. Treating this as complete would return before the upgrade even
    // starts.
    const stale = database({
      version: "8.4",
      status: "ready",
      statusSetAt: statusSetAtBefore,
    });

    expect(isUpgradeComplete(stale, "8.4", statusSetAtBefore)).toBe(false);
  });

  it("is not complete while the database is pending", () => {
    const pending = database({
      version: "8.4",
      status: "pending",
      statusSetAt: "2024-01-01T00:00:05Z",
    });

    expect(isUpgradeComplete(pending, "8.4", statusSetAtBefore)).toBe(false);
  });

  it("is complete once the database is ready again with a newer status timestamp", () => {
    const ready = database({
      version: "8.4",
      status: "ready",
      statusSetAt: "2024-01-01T00:00:20Z",
    });

    expect(isUpgradeComplete(ready, "8.4", statusSetAtBefore)).toBe(true);
  });

  it("is not complete when the database is ready but reports another version", () => {
    const otherVersion = database({
      version: "8.0",
      status: "ready",
      statusSetAt: "2024-01-01T00:00:20Z",
    });

    expect(isUpgradeComplete(otherVersion, "8.4", statusSetAtBefore)).toBe(
      false,
    );
  });

  it("is not complete when the upgrade failed", () => {
    const failed = database({
      version: "8.4",
      status: "error",
      statusSetAt: "2024-01-01T00:00:20Z",
    });

    expect(isUpgradeComplete(failed, "8.4", statusSetAtBefore)).toBe(false);
  });
});
