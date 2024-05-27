export type OptionalFn<T> = T extends (i: infer TIn) => infer TOut
  ? (i: TIn | undefined) => TOut | undefined
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
  fn: (input: TIn) => TOut,
): OptionalFn<(input: TIn) => TOut> {
  return (input: TIn | undefined) => (input ? fn(input) : undefined);
}

export default maybe;
