import prettyBytes, { Options } from "pretty-bytes";
import { Flags } from "@oclif/core";

/**
 * Reexport of pretty-bytes Options type, as to not expose the pretty-bytes
 * dependency to the outside world.
 */
export type ByteQuantityFormattingOptions = Options;

/**
 * Represents a quantity of bytes. Provides methods for parsing, formatting and
 * manipulating byte quantities.
 */
export default class ByteQuantity {
  public readonly bytes: number;

  public static flag = Flags.custom<ByteQuantity>({
    parse: async (input) => ByteQuantity.fromString(input, true),
  });

  private constructor(bytes: number) {
    this.bytes = bytes;
  }

  public static fromBytes(bytes: number): ByteQuantity {
    return new ByteQuantity(bytes);
  }

  public static fromString(
    input: string,
    requireQuantity = false,
  ): ByteQuantity {
    const numeric = parseInt(input.replace(/[^0-9]/g, ""), 10);

    if (
      (!requireQuantity && `${numeric}` == input) ||
      input.toLowerCase().match(/[0-9]b?$/)
    ) {
      return new ByteQuantity(numeric);
    }
    if (input.toLowerCase().match(/gi?b?$/)) {
      return new ByteQuantity(numeric * (1 << 30));
    }
    if (input.toLowerCase().match(/mi?b?$/)) {
      return new ByteQuantity(numeric * (1 << 20));
    }
    if (input.toLowerCase().match(/ki?b?$/)) {
      return new ByteQuantity(numeric * (1 << 10));
    }

    throw new Error(
      "unsupported byte unit; supported are 'gi(b)', 'mi(b)', 'ki(b)' or 'b'",
    );
  }

  public format(opts?: ByteQuantityFormattingOptions): string {
    return prettyBytes(this.bytes, { binary: true, ...opts });
  }

  public toString(): string {
    return this.format({
      locale: false,
      binary: true,
      space: false,
      maximumFractionDigits: 0,
    });
  }

  public add(other: ByteQuantity): ByteQuantity {
    return new ByteQuantity(this.bytes + other.bytes);
  }
}
