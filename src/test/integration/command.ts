import { spawn } from "node:child_process";

export type DevCommandResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  error?: Error;
  timedOut?: boolean;
};

export type RunDevCommandOptions = {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  timeoutMs?: number;
};

export async function runDevCommand(
  args: string[],
  options: RunDevCommandOptions = {},
): Promise<DevCommandResult> {
  return await new Promise((resolve) => {
    const timeoutMs = options.timeoutMs ?? 30_000;

    const child = spawn(
      "yarn",
      [
        "node",
        "--import",
        "tsx",
        "--no-warnings=ExperimentalWarning",
        "./bin/dev.js",
        ...args,
      ],
      {
        cwd: options.cwd ?? process.cwd(),
        env: options.env ?? process.env,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    let stdout = "";
    let stderr = "";
    let settled = false;
    let didTimeOut = false;

    const finish = (result: DevCommandResult): void => {
      if (settled) {
        return;
      }

      settled = true;
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      if (forceKillHandle) {
        clearTimeout(forceKillHandle);
      }

      resolve(result);
    };

    let forceKillHandle: NodeJS.Timeout | undefined;
    const timeoutHandle: NodeJS.Timeout | undefined =
      timeoutMs > 0
        ? setTimeout(() => {
            didTimeOut = true;
            child.kill("SIGTERM");

            // Give graceful termination a short window before hard-killing.
            forceKillHandle = setTimeout(() => {
              child.kill("SIGKILL");
            }, 2_000);
            forceKillHandle.unref?.();
          }, timeoutMs)
        : undefined;

    timeoutHandle?.unref?.();

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      finish({
        stdout,
        stderr,
        exitCode: null,
        signal: null,
        timedOut: didTimeOut,
        error,
      });
    });

    child.on("close", (exitCode, signal) => {
      if (didTimeOut) {
        finish({
          stdout,
          stderr,
          exitCode,
          signal,
          timedOut: true,
          error: new Error(`dev.js subprocess timed out after ${timeoutMs}ms`),
        });
        return;
      }

      if (exitCode === 0) {
        finish({ stdout, stderr, exitCode, signal, timedOut: false });
        return;
      }

      finish({
        stdout,
        stderr,
        exitCode,
        signal,
        timedOut: false,
        error: new Error(`dev.js subprocess exited with code ${exitCode}`),
      });
    });
  });
}
