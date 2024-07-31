/**
 * Quickly checks if an error is a "file not found" error. Intended to be used
 * in a catch block around "fs" functions.
 *
 * @param e The error to check
 * @returns True if the error is a "file not found" error
 */
export function isNotFound(e: unknown): boolean {
  return e instanceof Error && "code" in e && e.code === "ENOENT";
}
