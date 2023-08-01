import crypto from "crypto";

const passwordAllowedSpecialChars: string[] = ["%", "_", "-", "+", "&"];
const defaultPasswordLength = 32;
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - 1) + min);
}

function getRandomSpecialCharacter(): string {
  return passwordAllowedSpecialChars[
    randomInt(0, passwordAllowedSpecialChars.length - 1)
  ];
}
export function generatePassword(
  length: number = defaultPasswordLength,
): string {
  return crypto.randomBytes(length).toString("base64").substring(0, length);
}
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
