import { describe, expect, it } from "@jest/globals";
import {
  hasExtendedSupportSuffix,
  stripPatchLevelVersion,
} from "./config_builder.js";

describe("hasExtendedSupportSuffix", () => {
  it("returns true for extended support versions", () => {
    expect(hasExtendedSupportSuffix("7.2-es")).toBe(true);
    expect(hasExtendedSupportSuffix("7.1-es")).toBe(true);
    expect(hasExtendedSupportSuffix("8.0-es")).toBe(true);
  });

  it("returns false for regular versions", () => {
    expect(hasExtendedSupportSuffix("7.2")).toBe(false);
    expect(hasExtendedSupportSuffix("8.3")).toBe(false);
    expect(hasExtendedSupportSuffix("7.2.1")).toBe(false);
    expect(hasExtendedSupportSuffix("7.2-lts")).toBe(false);
  });
});

describe("stripPatchLevelVersion", () => {
  it("strips patch level from regular versions", () => {
    expect(stripPatchLevelVersion("7.2.5")).toBe("7.2");
    expect(stripPatchLevelVersion("8.3.1")).toBe("8.3");
  });

  it("strips extended support suffix from versions", () => {
    expect(stripPatchLevelVersion("7.2-es")).toBe("7.2");
    expect(stripPatchLevelVersion("7.1-es")).toBe("7.1");
    expect(stripPatchLevelVersion("8.0-es")).toBe("8.0");
  });

  it("returns major.minor unchanged for already-stripped versions", () => {
    expect(stripPatchLevelVersion("7.2")).toBe("7.2");
    expect(stripPatchLevelVersion("8.3")).toBe("8.3");
  });
});
