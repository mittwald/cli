import { Flags } from "@oclif/core";
import parseDuration from "parse-duration";
import { OptionFlag } from "@oclif/core/lib/interfaces/parser.js";

const durationFlag = Flags.custom<Date>({
  parse: async (input) => {
    const d = new Date();
    const i = parseDuration(input);

    if (!i) {
      throw new Error("could not parse duration: " + input);
    }

    return new Date(d.getTime() + i);
  },
});

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
    expires: durationFlag({
      description: `An interval after which the ${resourceName} expires (examples: 30m, 30d, 1y).`,
      multiple: false,
      required,
    }),
  };
}
