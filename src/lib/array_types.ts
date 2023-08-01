// Note: We cannot use the "ArrayElement" type from type-fest, because that only
// looks at the _first_ element of an array type.
//
// Stolen from https://stackoverflow.com/a/51399781/1995300
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
