export const mergeObjects = <T1, T2>(obj1: T1, obj2: T2): T1 & T2 => {
  return {
    ...Object.fromEntries(
      Object.entries(obj1 ?? {}).filter(([, value]) => !!value),
    ),
    ...Object.fromEntries(
      Object.entries(obj2 ?? {}).filter(([, value]) => !!value),
    ),
  } as T1 & T2;
};
