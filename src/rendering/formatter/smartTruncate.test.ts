import smartTruncate from "./smartTruncate.js";
import { expect } from "@jest/globals";

describe("smartTruncate", () => {
  it("leaves short strings as is", () => {
    expect(smartTruncate("short string", 100)).toBe("short string");
  });

  it("truncates long strings", () => {
    expect(smartTruncate("1234567890", 5)).toBe("1234…");
  });

  it("truncates long strings with ANSI escape codes", () => {
    expect(smartTruncate("\u001b[33m1234567890\u001b[0m", 5)).toBe(
      "\u001b[33m1234\u001b[39m…",
    );
  });
});
