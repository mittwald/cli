import fs from "fs/promises";

import { isNotFound } from "./isNotFound.js";

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
