import { appendFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type MachineLogEntry = Record<string, unknown>;

export async function initializeMachineLogFile(filePath: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, "", "utf-8");
}

export async function appendMachineLogEntry(
  filePath: string,
  entry: MachineLogEntry,
): Promise<void> {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...entry,
  });

  await appendFile(filePath, `${line}\n`, "utf-8");
}
