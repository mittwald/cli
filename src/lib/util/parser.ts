/**
 * Parses environment variables from array and strips unnecessary quotes from
 * values.
 *
 * @param envFlags Array of environment variable strings in KEY=VALUE format
 * @returns An object containing environment variable key-value pairs
 */
export function parseEnvironmentVariablesFromArray(
  envFlags: string[] = [],
): Record<string, string> {
  const splitIntoKeyAndValue = (e: string) => {
    const index = e.indexOf("=");
    if (index < 0) {
      throw new Error(`Invalid environment variable format: ${e}`);
    }
    const key = e.slice(0, index);
    const rawValue = e.slice(index + 1);

    // Remove enclosing quotes (if they exist)
    const isQuoted = rawValue.startsWith('"') && rawValue.endsWith('"');
    const value = isQuoted ? rawValue.slice(1, -1) : rawValue;

    return [key, value];
  };

  return Object.fromEntries(envFlags.map(splitIntoKeyAndValue));
}
