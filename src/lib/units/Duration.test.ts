import { describe, expect, test } from "@jest/globals";
import Duration from "./Duration.js";

describe("Duration class", () => {
  describe("Static factory methods", () => {
    test("fromZero should return a Duration of 0 milliseconds", () => {
      const duration = Duration.fromZero();
      expect(duration.milliseconds).toBe(0);
    });

    test("fromMilliseconds should return a Duration with the given milliseconds", () => {
      const duration = Duration.fromMilliseconds(500);
      expect(duration.milliseconds).toBe(500);
    });

    test("fromSeconds should return a Duration with the given seconds converted to milliseconds", () => {
      const duration = Duration.fromSeconds(2);
      expect(duration.milliseconds).toBe(2000);
    });

    test("fromString should parse valid duration strings", () => {
      const duration = Duration.fromString("2s");
      expect(duration.milliseconds).toBe(2000);
    });

    test("fromString should throw an error for invalid input", () => {
      expect(() => Duration.fromString("invalid")).toThrow(
        "could not parse duration: invalid",
      );
    });
  });

  describe("Instance methods", () => {
    test("seconds should return duration in seconds", () => {
      const duration = Duration.fromMilliseconds(3000);
      expect(duration.seconds).toBe(3);
    });

    test("from should return a Date object offset by the duration", () => {
      const baseDate = new Date("2023-01-01T00:00:00Z");
      const duration = Duration.fromSeconds(10);
      expect(duration.from(baseDate)).toEqual(new Date("2023-01-01T00:00:10Z"));
    });

    test("fromNow should return a future Date object", () => {
      const duration = Duration.fromSeconds(5);
      const now = new Date();
      const future = duration.fromNow();
      expect(future.getTime()).toBeGreaterThan(now.getTime());
    });

    test("add should correctly add two durations", () => {
      const duration1 = Duration.fromSeconds(10);
      const duration2 = Duration.fromSeconds(5);
      const result = duration1.add(duration2);
      expect(result.milliseconds).toBe(15000);
    });

    test("compare should return correct comparison results", () => {
      const duration1 = Duration.fromSeconds(10);
      const duration2 = Duration.fromSeconds(5);
      expect(duration1.compare(duration2)).toBeGreaterThan(0);
      expect(duration2.compare(duration1)).toBeLessThan(0);
      expect(duration1.compare(duration1)).toBe(0);
    });

    test("toString should return formatted duration string", () => {
      expect(Duration.fromMilliseconds(500).toString()).toBe("500ms");
      expect(Duration.fromSeconds(3).toString()).toBe("3s");
    });
  });
});
