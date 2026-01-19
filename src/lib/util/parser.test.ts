import { describe, expect, test } from "@jest/globals";
import { parseEnvironmentVariablesFromArray } from "./parser.js";

describe("Containerconfig handling", () => {
  describe("Config parsing", () => {
    test("call parser with simple flags", () => {
      const args = ["foo=bar", "ham=eggs"];
      const res = parseEnvironmentVariablesFromArray(args);
      expect(res).toStrictEqual({
        foo: "bar",
        ham: "eggs",
      });
    });

    test("call parser with flag containing another '='", () => {
      const args = ["extra_args=first=1 second=2 third=littlebitoflove"];
      const res = parseEnvironmentVariablesFromArray(args);
      expect(res).toStrictEqual({
        extra_args: "first=1 second=2 third=littlebitoflove",
      });
    });

    test("throw error for invalid flag format", () => {
      const args = ["invalidFlagWithoutEqualsSign"];

      expect(() => parseEnvironmentVariablesFromArray(args)).toThrow(
        "Invalid environment variable format: invalidFlagWithoutEqualsSign",
      );
    });
  });
});
