import crypto from "crypto";

export const defaultPasswordLength = 32;

/**
 * Generates a random password of a given length. The password is generated from
 * the base64 alphabet.
 *
 * @param length The desired amount of characters
 * @returns The generated password
 */
export function generatePassword(
  length: number = defaultPasswordLength,
): string {
  return crypto.randomBytes(length).toString("base64").substring(0, length);
}
