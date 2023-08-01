export async function waitUntil<T>(
  tester: () => Promise<T | null>,
  timeoutSeconds = 600,
): Promise<T> {
  let waited = 0;
  while (waited < timeoutSeconds) {
    const result = await tester();
    if (result) {
      return result;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    waited++;
  }

  throw new Error(
    `expected condition was not reached after ${timeoutSeconds} seconds`,
  );
}
