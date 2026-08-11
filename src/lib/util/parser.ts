/**
 * Parses environment variables from array and strips unnecessary quotes from
 * values.
 *
 * Supports both KEY=VALUE and KEY formats. For KEY entries, values are resolved
 * from sourceEnv (defaults to process.env), matching docker run behavior.
 *
 * @param envFlags Array of environment variable strings in KEY=VALUE or KEY
 *   format
 * @param sourceEnv Source environment for KEY passthrough entries
 * @returns An object containing environment variable key-value pairs
 */
export function parseEnvironmentVariablesFromArray(
  envFlags: string[] = [],
  sourceEnv: NodeJS.ProcessEnv = process.env,
): Record<string, string> {
  const splitIntoKeyAndValue = (e: string): [string, string] => {
    const index = e.indexOf("=");
    if (index < 0) {
      const key = e.trim();
      if (!key) {
        throw new Error(`Invalid environment variable format: ${e}`);
      }

      const value = sourceEnv[key];
      if (value === undefined) {
        throw new Error(
          `Environment variable ${key} is not set in the caller environment. ` +
            `If you are using fish, export it first with: set -x ${key} <value>`,
        );
      }

      return [key, value];
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

/**
 * Parses environment variables from string. Called with .env file content.
 *
 * @param src String describing environment, .env file notation
 * @returns An object containing environment variable key-value pairs
 */
export function parseEnvironmentVariablesFromStr(
  src: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = src.toString().split("\n");
  for (const line of lines) {
    const match = line.match(/^([^=:#]+?)[=:](.*)/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      result[key] = value;
    }
  }
  return result;
}
