import path from "path";
import fs from "fs";

export async function hasBinary(name: string): Promise<boolean> {
  const p = process.env.PATH ?? "";
  const pathItems = p.split(path.delimiter);

  for (const item of pathItems) {
    const fullPath = path.join(item, name);
    try {
      fs.statSync(fullPath);
      return true;
    } catch (e) {
      // ignore
    }
  }

  return false;
}
