import { ChildProcessByStdio } from "child_process";
import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";

export interface RunIO {
  input: NodeJS.ReadableStream | null;
  output: NodeJS.WritableStream | null;
}

export async function waitForProcessIO(
  proc: ChildProcessByStdio<Writable | null, Readable | null, Readable>,
  { input = null, output = null }: RunIO,
): Promise<void> {
  let err = "";

  if (input && proc.stdin) {
    input.pipe(proc.stdin);
  }

  proc.stderr.on("data", (data) => {
    err += data.toString();
  });

  // "close" (unlike "exit") fires only after the process's output streams have ended.
  const closed = new Promise<number | null>((res) => {
    proc.on("close", (code) => res(code));
  });

  const copied =
    output && proc.stdout
      ? pipeline(proc.stdout, output, { end: output !== process.stdout })
      : Promise.resolve();

  const [code] = await Promise.all([closed, copied]);
  if (code !== 0) {
    throw new Error(`command exited with code ${code}\n${err}`);
  }
}
