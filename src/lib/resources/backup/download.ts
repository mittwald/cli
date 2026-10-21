import { createHash } from "crypto";
import * as fs from "fs";
import { pipeline } from "stream/promises";

export async function writeStreamToFile(
  source: NodeJS.ReadableStream,
  filename: string,
  append: boolean,
): Promise<void> {
  const outputStream = fs.createWriteStream(filename, {
    flags: append ? "a" : undefined,
  });
  await pipeline(source, outputStream);
}

// Reads the file back from disk, so the check covers what was actually written.
export async function verifyFileChecksum(
  filename: string,
  expectedSha256: string,
): Promise<void> {
  const hash = createHash("sha256");
  for await (const chunk of fs.createReadStream(filename)) {
    hash.update(chunk);
  }

  const actual = hash.digest("hex");
  const expected = expectedSha256.toLowerCase();
  if (actual !== expected) {
    throw new Error(
      `checksum mismatch for ${filename} (file kept for inspection)\n` +
        `  expected sha256: ${expected}\n` +
        `  actual sha256:   ${actual}`,
    );
  }
}
