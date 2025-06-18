import tempfile from "tempfile";
import fs from "fs";
import cp from "child_process";

/**
 * Prints the given content to a pager, such as `less`. This function respects
 * the `PAGER` environment variable.
 *
 * @param content
 */
export function printToPager(content: string): void {
  const t = tempfile();

  try {
    fs.writeFileSync(t, content, { encoding: "utf8" });
    cp.spawnSync(process.env.PAGER || "less", [t], {
      stdio: "inherit",
    });
  } finally {
    fs.unlinkSync(t);
  }
}
