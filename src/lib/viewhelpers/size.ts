import prettyBytes, { Options } from "pretty-bytes";

export function formatBytes(bytes = 0, opts: Options = {}): string {
  return prettyBytes(bytes, { binary: true, ...opts });
}
