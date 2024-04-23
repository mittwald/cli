import { articleForWord } from "../language.js";

export default class UnexpectedShortIDPassedError extends Error {
  public readonly resourceName: string;
  public readonly format: string;

  public constructor(name: string, format: string) {
    super(
      `This command expects ${articleForWord(name)} ${name}, which is typically formatted as ${format}. It looks like you passed a short ID for another type of resource, instead.`,
    );

    this.resourceName = name;
    this.format = format;
  }
}
