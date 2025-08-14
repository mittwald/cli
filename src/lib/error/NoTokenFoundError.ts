/**
 * This class represents a custom error thrown when no token can be found. The
 * error specifically occurs if the token is not provided via the --token flag,
 * the MITTWALD_API_TOKEN environment variable, or the configuration file.
 *
 * This is a dedicated error class so that the error handler can check for this
 * specific type of error and present it differently to the user.
 */
export default class NoTokenFoundError extends Error {
  constructor(tokenFilename: string) {
    super(
      `Could not get token from --token flag, MITTWALD_API_TOKEN env var, or config file (${tokenFilename}). Please run "mw login token" or use --token.`,
    );
  }
}
