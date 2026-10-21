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
