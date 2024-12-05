import parseDuration from "parse-duration";
import { FlagDefinition } from "@oclif/core/interfaces";
import { Flags } from "@oclif/core";

/**
 * Represents a duration of time.
 *
 * This class represents a duration of time and offers utility methods around
 * this.
 */
export default class Duration {
  public readonly milliseconds: number;

  public static relativeFlag: FlagDefinition<Duration> = Flags.custom<Duration>(
    {
      parse: async (input) => Duration.fromString(input),
    },
  );

  public static absoluteFlag: FlagDefinition<Date> = Flags.custom<Date>({
    parse: async (input) => Duration.fromString(input).fromNow(),
  });

  private constructor(milliseconds: number) {
    this.milliseconds = milliseconds;
  }

  public static fromZero(): Duration {
    return new Duration(0);
  }

  public static fromMilliseconds(milliseconds: number): Duration {
    return new Duration(milliseconds);
  }

  public static fromSeconds(seconds: number): Duration {
    return new Duration(seconds * 1000);
  }

  public static fromString(input: string): Duration {
    const parsed = parseDuration(input);
    if (parsed === null) {
      throw new Error("could not parse duration: " + input);
    }
    return new Duration(parsed);
  }

  public get seconds(): number {
    return this.milliseconds / 1000;
  }

  public from(referenceDate: Date): Date {
    return new Date(referenceDate.getTime() + this.milliseconds);
  }

  public fromNow(): Date {
    return this.from(new Date());
  }

  public add(other: Duration): Duration {
    return new Duration(this.milliseconds + other.milliseconds);
  }

  public compare(other: Duration): number {
    return this.milliseconds - other.milliseconds;
  }

  public toString(): string {
    if (this.milliseconds > 1000) {
      return `${Math.round(this.seconds)}s`;
    }

    return `${this.milliseconds}ms`;
  }
}
