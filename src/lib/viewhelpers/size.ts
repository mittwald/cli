import prettyBytes from "pretty-bytes";

export function formatBytes(bytes = 0): string {
  return prettyBytes(bytes, { binary: true });
}
