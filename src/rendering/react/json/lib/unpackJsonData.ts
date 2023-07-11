export const unpackJsonData = (json: unknown): unknown => {
  const entries =
    json && typeof json === "object" ? Object.entries(json) : undefined;
  const firstEntry = entries?.[0];
  return entries?.length === 1 && firstEntry ? firstEntry[1] : json;
};
