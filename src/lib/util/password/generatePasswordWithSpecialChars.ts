import { defaultPasswordLength, generatePassword } from "./generatePassword.js";

const passwordAllowedSpecialChars: string[] = ["%", "_", "-", "+", "&"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - 1) + min);
}

function getRandomSpecialCharacter(): string {
  return passwordAllowedSpecialChars[
    randomInt(0, passwordAllowedSpecialChars.length - 1)
  ];
}

/**
 * Generates a random password of a given length with a specific amount of
 * special characters.
 *
 * @param length The desired amount of characters
 * @param amountSpecialChars The desired amount of special characters
 * @returns The generated password
 */
export function generatePasswordWithSpecialChars(
  length: number = defaultPasswordLength,
  amountSpecialChars: number = Math.floor(length / 8),
): string {
  const passwordCharacters: string[] = generatePassword(length).split("");

  for (let i = 0; i < amountSpecialChars; i++) {
    passwordCharacters[randomInt(1, passwordCharacters.length - 1)] =
      getRandomSpecialCharacter();
  }

  return passwordCharacters.join("");
}
