import fs from "fs/promises";

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

/**
 * Checks if a filesystem path exists.
 *
 * @param path The filesystem path (file or directory) to check
 * @returns True if the path exists
 */
export async function pathExists(path: string): Promise<boolean> {
  try {
    await fs.stat(path);
    return true;
  } catch (e) {
    if (isNotFound(e)) {
      return false;
    }
    throw e;
  }
}
