import { describe, it, expect } from "@jest/globals";
import { isSensitiveName } from "./isSensitiveName.js";

describe("isSensitiveName", () => {
  it.each([
    "PASSWORD",
    "DB_PASSWORD",
    "db-password",
    "dbPassword",
    "MYSQL_ROOT_PASSWD",
    "GPG_PASSPHRASE",
    "APP_SECRET",
    "ACCESS_TOKEN",
    "API_KEY",
    "apiKey",
    "PRIVATE_KEY",
    "REGISTRY_CREDENTIALS",
  ])("treats '%s' as sensitive", (name) => {
    expect(isSensitiveName(name)).toBe(true);
  });

  it.each([
    "DOMAIN",
    "ADMIN_EMAIL",
    "PORT",
    "TIMEZONE",
    "DB_NAME",
    "PUBLIC_URL",
  ])("treats '%s' as not sensitive", (name) => {
    expect(isSensitiveName(name)).toBe(false);
  });
});
