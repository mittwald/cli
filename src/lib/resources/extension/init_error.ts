/**
 * Domain-specific error that is thrown when attempting to initialize a new
 * extension manifest file, but a file with the same name already exists.
 */
export class ManifestAlreadyExistsError extends Error {
  public readonly filename: string;

  constructor(filename: string, overwriteFlagName: string) {
    super(`File already exists. Use --${overwriteFlagName} to overwrite it.`);
    this.filename = filename;
  }
}
