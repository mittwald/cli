import fs from "fs/promises";

export function isNotFound(e: unknown): boolean {
  return e instanceof Error && "code" in e && e.code === "ENOENT";
}

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
