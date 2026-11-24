import type { AxiosError } from "@mittwald/api-client-commons";
import type { ExitError } from "@oclif/core/errors";

/*
 * Type guards for errors that are thrown in one place and handled in another.
 *
 * Errors thrown by plugin commands come from the plugin's own copies of the
 * CLI's dependencies (and of the CLI itself), so "instanceof" checks against
 * the classes loaded by the CLI fail for them. These guards check the shape of
 * an error instead.
 */

export function isAxiosError(err: unknown): err is AxiosError {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { isAxiosError?: unknown }).isAxiosError === true
  );
}

export function isExitError(err: unknown): err is ExitError {
  return (
    err instanceof Error &&
    (err as { code?: unknown }).code === "EEXIT" &&
    typeof (err as { oclif?: { exit?: unknown } }).oclif?.exit === "number"
  );
}

/**
 * Checks if an error is an instance of the given error class (or of a copy of
 * it), comparing the error's name to the class name. The class must set its
 * "name" property to its class name.
 */
export function isErrorOfClass<T extends Error>(
  err: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cls: abstract new (...args: any[]) => T,
): err is T {
  return err instanceof cls || (err instanceof Error && err.name === cls.name);
}
