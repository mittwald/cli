/**
 * Substrings that indicate that a value is sensitive and should therefore be
 * masked when the user is prompted for it.
 *
 * Deliberately errs on the side of masking: masking a harmless value is a minor
 * annoyance, whereas echoing a password to the terminal (and into the process
 * summary) is not.
 */
const sensitiveSubstrings = [
  "password",
  "passwd",
  "passphrase",
  "secret",
  "token",
  "apikey",
  "privatekey",
  "credential",
];

/**
 * Determines whether a value identified by the given name should be treated as
 * sensitive, and therefore be masked on input.
 *
 * The container template API does not mark user inputs as sensitive, so this
 * heuristic on the input's name is the best signal available.
 *
 * Matching is case-insensitive and ignores separators, so that `DB_PASSWORD`,
 * `db-password` and `dbPassword` are all recognized.
 *
 * @param name Name of the input, environment variable or similar
 */
export function isSensitiveName(name: string): boolean {
  const normalized = name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "");

  return sensitiveSubstrings.some((substring) =>
    normalized.includes(substring),
  );
}
