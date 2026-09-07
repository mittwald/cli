import { describe, expect, it } from "@jest/globals";
import { buildCronjobTarget, getCronjobServiceTarget } from "./target.js";

const stackId = "7a9d8971-09b0-4c39-8c64-546b6e1875ce";
const serviceId = "2d0a0b1e-4f1c-4a8e-9d3b-0f9a1f2b3c4d";
const appInstallationId = "83e0cb85-dcf7-4968-8646-87a63980ae91";

describe("buildCronjobTarget", () => {
  describe("container cron jobs", () => {
    it("builds a service target from container and command", () => {
      expect(
        buildCronjobTarget({
          container: { stackId, serviceId },
          command: "php artisan schedule:run",
        }),
      ).toEqual({
        stackId,
        serviceIdentifier: serviceId,
        command: "php artisan schedule:run",
      });
    });

    it("prefers the container over an app installation", () => {
      const target = buildCronjobTarget({
        appInstallationId,
        container: { stackId, serviceId },
        command: "true",
      });
      expect(target).toHaveProperty("stackId", stackId);
      expect(target).not.toHaveProperty("appInstallationId");
    });

    it("rejects a missing command", () => {
      expect(() =>
        buildCronjobTarget({ container: { stackId, serviceId } }),
      ).toThrow(/require a --command/);
    });

    it("rejects a URL", () => {
      expect(() =>
        buildCronjobTarget({
          container: { stackId, serviceId },
          command: "true",
          url: "https://example.com",
        }),
      ).toThrow(/only support --command/);
    });

    it("rejects an interpreter", () => {
      expect(() =>
        buildCronjobTarget({
          container: { stackId, serviceId },
          command: "true",
          interpreter: "bash",
        }),
      ).toThrow(/only support --command/);
    });
  });

  describe("app cron jobs", () => {
    it("builds a URL destination", () => {
      expect(
        buildCronjobTarget({ appInstallationId, url: "https://example.com" }),
      ).toEqual({
        appInstallationId,
        destination: { url: "https://example.com" },
      });
    });

    it("builds a command destination with a mapped interpreter", () => {
      expect(
        buildCronjobTarget({
          appInstallationId,
          command: "cron.php --verbose",
          interpreter: "php",
        }),
      ).toEqual({
        appInstallationId,
        destination: {
          interpreter: "/usr/bin/php",
          path: "cron.php --verbose",
        },
      });
    });

    it("rejects a command without interpreter", () => {
      expect(() =>
        buildCronjobTarget({ appInstallationId, command: "cron.php" }),
      ).toThrow();
    });

    it("rejects a missing app installation and container", () => {
      expect(() => buildCronjobTarget({ url: "https://example.com" })).toThrow(
        /app installation or a container/,
      );
    });
  });
});

describe("getCronjobServiceTarget", () => {
  const base = {
    id: "c1",
    shortId: "c-xxxxxx",
    active: true,
    appId: appInstallationId,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    description: "test",
    failedExecutionAlertThreshold: 1,
    interval: "* * * * *",
    timeout: 60,
  };

  it("returns the service target of a container cron job", () => {
    const target = { stackId, serviceShortId: "s-xxxxxx", command: "true" };
    expect(getCronjobServiceTarget({ ...base, target })).toEqual(target);
  });

  it("returns undefined for app cron jobs", () => {
    expect(
      getCronjobServiceTarget({
        ...base,
        target: { appInstallationId, destination: { url: "https://x" } },
      }),
    ).toBeUndefined();
    expect(getCronjobServiceTarget(base)).toBeUndefined();
  });
});
