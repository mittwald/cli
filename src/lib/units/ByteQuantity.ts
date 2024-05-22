import prettyBytes, { Options } from "pretty-bytes";

export default class ByteQuantity {
  private readonly bytes: number;

  public constructor(bytes: number) {
    this.bytes = bytes;
  }

  public static parse(input: string): ByteQuantity {
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

  public format(opts: Options): string {
    return prettyBytes(this.bytes, { binary: true, ...opts });
  }
}
