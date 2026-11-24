import path from "path";

// Service names are also used as image names and domain labels, so they are
// limited to the characters (and length) that are valid in all of these.
const maxServiceNameLength = 63;

/**
 * Derives a service name from a directory name, similar to how docker compose
 * derives a project name: the name is lowercased, every run of characters other
 * than [a-z0-9] is replaced by a single dash, and leading and trailing dashes
 * are removed.
 *
 * @returns The service name, or undefined if the directory name contains no
 *   usable characters.
 */
export function serviceNameFromDirectory(
  directory: string,
): string | undefined {
  const name = path
    .basename(path.resolve(directory))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, maxServiceNameLength)
    .replace(/^-+|-+$/g, "");

  return name || undefined;
}
