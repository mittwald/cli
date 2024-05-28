export type OptionalFn<T> = T extends (...i: infer TIn) => infer TOut
  ? (...i: (TIn[number] | undefined)[]) => TOut | undefined
  : never;

/**
 * Maybe is a helper function that wraps a function and makes its input
 * optional. When the input is undefined, the function will return undefined.
 * Otherwise, the function will be called with the input.
 *
 * @param fn The function to wrap.
 * @returns A new function that takes an optional input, and returns undefined
 *   if the input is undefined.
 */
export function maybe<TIn, TOut>(
  fn: (...inputs: TIn[]) => TOut,
): OptionalFn<(...inputs: TIn[]) => TOut> {
  return (...args: (TIn | undefined)[]) => {
    return !args.some((a) => a === undefined)
      ? fn(...(args as TIn[]))
      : undefined;
  };
}

export default maybe;
