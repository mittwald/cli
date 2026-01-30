import { describe, expect, test } from "@jest/globals";
import {
  parseEnvironmentVariablesFromArray,
  parseEnvironmentVariablesFromStr,
} from "./parser.js";

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

    test("remove enclosing quotes from values", () => {
      const args = ['foo="bar"', 'ham="eggs and bacon"'];
      const res = parseEnvironmentVariablesFromArray(args);
      expect(res).toStrictEqual({
        foo: "bar",
        ham: "eggs and bacon",
      });
    });

    test("preserve values without quotes", () => {
      const args = ["foo=bar", "ham=eggs"];
      const res = parseEnvironmentVariablesFromArray(args);
      expect(res).toStrictEqual({
        foo: "bar",
        ham: "eggs",
      });
    });

    test("preserve values with quotes in the middle", () => {
      const args = ['foo=bar"baz', 'ham=eggs"and"bacon'];
      const res = parseEnvironmentVariablesFromArray(args);
      expect(res).toStrictEqual({
        foo: 'bar"baz',
        ham: 'eggs"and"bacon',
      });
    });
  });

  describe("parseEnvironmentVariablesFromStr", () => {
    test("parse simple .env format", () => {
      const src = "foo=bar\nham=eggs";
      const res = parseEnvironmentVariablesFromStr(src);
      expect(res).toStrictEqual({
        foo: "bar",
        ham: "eggs",
      });
    });

    test("parse .env format with colon separator", () => {
      const src = "foo:bar\nham:eggs";
      const res = parseEnvironmentVariablesFromStr(src);
      expect(res).toStrictEqual({
        foo: "bar",
        ham: "eggs",
      });
    });

    test("parse .env format with empty lines", () => {
      const src = "foo=bar\n\nham=eggs\n";
      const res = parseEnvironmentVariablesFromStr(src);
      expect(res).toStrictEqual({
        foo: "bar",
        ham: "eggs",
      });
    });

    test("parse .env format with comments", () => {
      const src = "foo=bar\n# comment line\nham=eggs";
      const res = parseEnvironmentVariablesFromStr(src);
      expect(res).toStrictEqual({
        foo: "bar",
        ham: "eggs",
      });
    });

    test("parse .env format with values containing equals signs", () => {
      const src = "extra_args=first=1 second=2 third=littlebitoflove";
      const res = parseEnvironmentVariablesFromStr(src);
      expect(res).toStrictEqual({
        extra_args: "first=1 second=2 third=littlebitoflove",
      });
    });

    test("trim whitespace from keys and values", () => {
      const src = "  foo  =  bar  \n  ham  :  eggs  ";
      const res = parseEnvironmentVariablesFromStr(src);
      expect(res).toStrictEqual({
        foo: "bar",
        ham: "eggs",
      });
    });

    test("handle empty string input", () => {
      const src = "";
      const res = parseEnvironmentVariablesFromStr(src);
      expect(res).toStrictEqual({});
    });

    test("ignore lines without key-value pairs", () => {
      const src = "foo=bar\ninvalid line\nham=eggs";
      const res = parseEnvironmentVariablesFromStr(src);
      expect(res).toStrictEqual({
        foo: "bar",
        ham: "eggs",
      });
    });
  });
});
