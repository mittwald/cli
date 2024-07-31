import { OptionFlag } from "@oclif/core/lib/interfaces/parser.js";
import Duration from "../units/Duration.js";

export function expireFlags(
  resourceName: string,
  required: false,
): { expires: OptionFlag<Date | undefined> };
export function expireFlags(
  resourceName: string,
  required: true,
): { expires: OptionFlag<Date> };

/**
 * Constructs a set of flags for specifying an expiration time for a resource.
 *
 * @param resourceName The name of the resource to expire.
 * @param required Whether the expiration time is required. NOTE: This
 *   function's overload signatures assert that if required, the flag will be of
 *   type `Date`, otherwise `Date | undefined`.
 */
export function expireFlags(
  resourceName: string,
  required: boolean,
): { expires: OptionFlag<Date | undefined> } {
  return {
    expires: Duration.absoluteFlag({
      description: `an interval after which the ${resourceName} expires (examples: 30m, 30d, 1y).`,
      multiple: false,
      required,
    }),
  };
}
