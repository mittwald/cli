/**
 * Error thrown when a command requires interactive input, but the current
 * terminal environment does not support it.
 */
export default class InteractiveInputRequiredError extends Error {
  constructor() {
    super(
      "This command requires an interactive input, but the current environment " +
        "does not support it. Please have a look at this command's --help page " +
        "to learn how to pass the required input non-interactively.",
    );
  }
}
