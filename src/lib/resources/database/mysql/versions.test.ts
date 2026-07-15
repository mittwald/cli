import { describe, expect, it } from "@jest/globals";
import { getUpgradeCandidates } from "./versions.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";

type MySqlVersion = MittwaldAPIV2.Components.Schemas.DatabaseMySqlVersion;

function version(number: string, disabled = false): MySqlVersion {
  return { id: `id-${number}`, name: `MySQL ${number}`, number, disabled };
}

describe("getUpgradeCandidates", () => {
  const versions = [
    version("5.7"),
    version("8.0"),
    version("8.4"),
    version("10.11"),
  ];

  it("only offers versions newer than the current one", () => {
    expect(getUpgradeCandidates(versions, "8.0").map((v) => v.number)).toEqual([
      "8.4",
      "10.11",
    ]);
  });

  it("compares versions numerically rather than lexically", () => {
    expect(getUpgradeCandidates(versions, "8.4").map((v) => v.number)).toEqual([
      "10.11",
    ]);
  });

  it("omits disabled versions", () => {
    const withDisabled = [version("8.0"), version("8.4", true)];

    expect(
      getUpgradeCandidates(withDisabled, "5.7").map((v) => v.number),
    ).toEqual(["8.0"]);
  });

  it("returns nothing when the current version is the latest", () => {
    expect(getUpgradeCandidates(versions, "10.11")).toEqual([]);
  });

  it("does not offer the current version itself", () => {
    expect(
      getUpgradeCandidates(versions, "5.7").map((v) => v.number),
    ).not.toContain("5.7");
  });
});
