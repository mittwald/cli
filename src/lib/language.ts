/**
 * Helper function to determine the grammatically correct article for a word.
 *
 * This is an approximation and ignores common exceptions, like unsounded "h"s.
 * However, for our purposes, it should be sufficient.
 *
 * @param word
 * @returns Returns "an" if the word starts with a vowel, "a" otherwise
 */
export function articleForWord(word: string): "an" | "a" {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}
