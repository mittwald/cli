export function parseBytes(input: string): number {
  const numeric = parseInt(input.replace(/[^0-9]/g, ""), 10);

  if (`${numeric}` == input) {
    return numeric;
  }

  if (input.toLowerCase().endsWith("gi")) {
    return numeric * (1 << 30);
  }
  if (input.toLowerCase().endsWith("mi")) {
    return numeric * (1 << 20);
  }
  if (input.toLowerCase().endsWith("ki")) {
    return numeric * (1 << 10);
  }

  throw new Error("unsupported byte unit; supported are 'gi', 'mi', 'ki'");
}
