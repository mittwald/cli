import { Flags } from "@oclif/core";
import parseDuration from "parse-duration";
import { OptionFlag } from "@oclif/core/lib/interfaces/parser.js";

export type ExpireFlags = {
  expires: string;
};

export function expireFlags(
  resourceName: string,
  required: false,
): { expires: OptionFlag<string | undefined> };

export function expireFlags(
  resourceName: string,
  required: true,
): { expires: OptionFlag<string> };

export function expireFlags(resourceName: string, required: boolean) {
  return {
    expires: Flags.string({
      description: `An interval after which the ${resourceName} expires (examples: 30m, 30d, 1y).`,
      required,
    }),
  };
}

export function expirationDateFromFlagsOptional(
  flags: Partial<ExpireFlags>,
): Date | undefined {
  if (!flags.expires) {
    return undefined;
  }

  return expirationDateFromFlags(flags as ExpireFlags);
}

export function expirationDateFromFlags(flags: ExpireFlags): Date {
  const d = new Date();
  const i = parseDuration(flags.expires);

  if (!i) {
    throw new Error("could not parse duration: " + flags.expires);
  }

  return new Date(d.getTime() + i);
}
