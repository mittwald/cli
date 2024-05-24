import prettyBytes, { Options } from "pretty-bytes";

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

  private constructor(bytes: number) {
    this.bytes = bytes;
  }

  public static fromBytes(bytes: number): ByteQuantity {
    return new ByteQuantity(bytes);
  }

  public static fromString(input: string): ByteQuantity {
    const numeric = parseInt(input.replace(/[^0-9]/g, ""), 10);

    if (`${numeric}` == input) {
      return new ByteQuantity(numeric);
    }

    if (input.toLowerCase().endsWith("gi")) {
      return new ByteQuantity(numeric * (1 << 30));
    }
    if (input.toLowerCase().endsWith("mi")) {
      return new ByteQuantity(numeric * (1 << 20));
    }
    if (input.toLowerCase().endsWith("ki")) {
      return new ByteQuantity(numeric * (1 << 10));
    }

    throw new Error("unsupported byte unit; supported are 'gi', 'mi', 'ki'");
  }

  public format(opts?: ByteQuantityFormattingOptions): string {
    return prettyBytes(this.bytes, { binary: true, ...opts });
  }

  public add(other: ByteQuantity): ByteQuantity {
    return new ByteQuantity(this.bytes + other.bytes);
  }
}
