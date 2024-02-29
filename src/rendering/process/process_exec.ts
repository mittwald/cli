import { spawn } from "child_process";
import { ProcessRenderer } from "./process.js";
import { ReactNode } from "react";

export async function spawnInProcess(
  r: ProcessRenderer,
  title: ReactNode,
  cmd: string,
  args: string[],
): Promise<void> {
  const step = r.addStep(title);

  const child = spawn(cmd, args, {
    shell: false,
    stdio: ["inherit", "pipe", "pipe"],
  });

  const appendOutput = (chunk: unknown) => {
    if (typeof chunk === "string") {
      step.appendOutput(chunk);
    }

    if (Buffer.isBuffer(chunk)) {
      step.appendOutput(chunk.toString());
    }
  };

  child.stdout.on("data", appendOutput);
  child.stderr.on("data", appendOutput);
  child.on("exit", (code) => {
    if (code === 0) {
      step.complete();
    } else {
      step.error(new Error(`${cmd} exited with code ${code}`));
    }
  });

  await step.wait();
}
