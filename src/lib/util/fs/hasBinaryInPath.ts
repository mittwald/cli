import path from "path";
import fs from "fs";

/**
 * Checks if a binary is in the PATH. This is useful for commands that rely on
 * external binaries to work. These should be asserted to exist before the
 * command does anything else.
 *
 * @param name The name of the binary to check for
 * @returns True if the binary is in the PATH
 */
export async function hasBinaryInPath(name: string): Promise<boolean> {
  const p = process.env.PATH ?? "";
  const pathItems = p.split(path.delimiter);

  for (const item of pathItems) {
    const fullPath = path.join(item, name);
    try {
      fs.statSync(fullPath);
      return true;
    } catch (ignoredError) {
      // ignore
    }
  }

  return false;
}
