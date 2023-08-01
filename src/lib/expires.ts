import { Flags } from "@oclif/core";
import parseDuration from "parse-duration";

export type ExpireFlags = {
  expires: string;
};

export function expireFlags(resourceName: string) {
  return {
    expires: Flags.string({
      description: `An interval after which the ${resourceName} expires (examples: 30m, 30d, 1y).`,
    }),
  };
}

export function expireFlagsRequired(resourceName: string) {
  return {
    expires: Flags.string({
      description: `An interval after which the ${resourceName} expires (examples: 30m, 30d, 1y).`,
      required: true,
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
