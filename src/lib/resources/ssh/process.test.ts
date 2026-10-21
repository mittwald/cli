import { afterEach, describe, expect, it } from "@jest/globals";
import cp, { ChildProcessByStdio } from "child_process";
import { Readable, Writable } from "stream";
import { waitForProcessIO } from "./process.js";

const firstPieceSize = 16 * 1024;
const secondPieceSize = 16 * 1024 + 123;
const payloadSize = firstPieceSize + secondPieceSize;

// The stub pauses between its two pieces; the output holds its first write for longer than that.
const stubGapMs = 100;
const outputHoldMs = 500;

type Stub = ChildProcessByStdio<null, Readable, Readable>;

function spawnStub(): Stub {
  const script = [
    `process.stdout.write(Buffer.alloc(${firstPieceSize}, 120));`,
    `setTimeout(() => process.stdout.write(Buffer.alloc(${secondPieceSize}, 121)), ${stubGapMs});`,
  ].join("");
  return cp.spawn(process.execPath, ["-e", script], {
    stdio: ["ignore", "pipe", "pipe"],
  }) as Stub;
}

// Holding the first write pauses the reader, so the second piece is still unread when the stub exits.
function outputHoldingFirstWrite(holdMs: number) {
  const chunks: Buffer[] = [];
  const errors: Error[] = [];
  const stream = new Writable({
    highWaterMark: 1024,
    write(chunk: Buffer, _enc, cb) {
      chunks.push(chunk);
      if (chunks.length === 1) {
        setTimeout(cb, holdMs);
      } else {
        cb();
      }
    },
  });
  stream.on("error", (err) => errors.push(err));
  return {
    stream,
    errors,
    received: () => chunks.reduce((n, c) => n + c.length, 0),
  };
}

describe("waitForProcessIO", () => {
  const spawned: Stub[] = [];

  afterEach(() => {
    for (const proc of spawned.splice(0)) {
      proc.stdout.destroy();
      proc.stderr.destroy();
    }
  });

  it("stub emits the full payload (harness control)", async () => {
    const proc = spawnStub();
    spawned.push(proc);

    let received = 0;
    proc.stdout.on("data", (chunk: Buffer) => (received += chunk.length));
    await new Promise((res) => proc.on("close", res));

    expect(received).toBe(payloadSize);
  });

  // Regression: resolving on "exit" ended the output while process output was still unread.
  it("delivers all output to a slow destination before resolving", async () => {
    const proc = spawnStub();
    spawned.push(proc);
    const output = outputHoldingFirstWrite(outputHoldMs);

    await waitForProcessIO(proc, { input: null, output: output.stream });

    expect(output.errors).toEqual([]);
    expect(output.received()).toBe(payloadSize);
  });
});
