import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { Readable } from "stream";
import { writeStreamToFile } from "./download.js";

function makePayload(size: number): Buffer {
  const buf = Buffer.alloc(size);
  for (let i = 0; i < size; i++) {
    buf[i] = i % 251;
  }
  return buf;
}

function chunked(data: Buffer, chunkSize: number): Readable {
  const chunks: Buffer[] = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.subarray(i, i + chunkSize));
  }
  return Readable.from(chunks);
}

describe("writeStreamToFile", () => {
  let tempDir: string;
  let target: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "backup-download-test-"));
    target = path.join(tempDir, "backup.tar.gz");
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  // Regression: file was truncated to a multiple of 4096 bytes because writes were not flushed.
  it("writes all bytes to disk before resolving", async () => {
    const payload = makePayload(64 * 16384 + 123);

    await writeStreamToFile(chunked(payload, 16384), target, false);

    const written = fs.readFileSync(target);
    expect(written.length).toBe(payload.length);
    expect(written.equals(payload)).toBe(true);
  });

  it("appends to an existing file when resuming", async () => {
    const payload = makePayload(3 * 16384 + 7);
    const head = payload.subarray(0, 10000);
    const tail = payload.subarray(10000);
    fs.writeFileSync(target, head);

    await writeStreamToFile(chunked(tail, 4096), target, true);

    expect(fs.readFileSync(target).equals(payload)).toBe(true);
  });

  it("overwrites an existing file when not resuming", async () => {
    fs.writeFileSync(target, "stale content that is longer than the payload");
    const payload = makePayload(42);

    await writeStreamToFile(chunked(payload, 16), target, false);

    expect(fs.readFileSync(target).equals(payload)).toBe(true);
  });

  it("rejects when the source stream fails", async () => {
    const source = new Readable({
      read() {
        this.destroy(new Error("connection reset"));
      },
    });

    await expect(writeStreamToFile(source, target, false)).rejects.toThrow(
      "connection reset",
    );
  });
});
