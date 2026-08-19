export type EnvSnapshot = NodeJS.ProcessEnv;

export function snapshotEnv(): EnvSnapshot {
  return { ...process.env };
}

export function restoreEnv(snapshot: EnvSnapshot): void {
  process.env = snapshot;
}

export function requireIntegrationEnv(
  envVars: string[],
  context: string,
): void {
  const missing = envVars.filter((envVar) => {
    const value = process.env[envVar];
    return value === undefined || value.trim() === "";
  });

  if (missing.length === 0) {
    return;
  }

  throw new Error(
    `[integration:${context}] Missing required environment variables: ${missing.join(", ")}. ` +
      "Set them before running this test.",
  );
}

export function configureIntegrationEnv(context: string): void {
  requireIntegrationEnv(
    ["MITTWALD_API_TOKEN", "MITTWALD_API_BASE_URL"],
    context,
  );
}
