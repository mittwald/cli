import { Args } from "@oclif/core";
import { ExtensionManifest } from "./manifest.js";
import yaml from "js-yaml";
import { readFile } from "fs/promises";

export const extensionManifestArg = Args.custom<string>({
  description: "file path to the extension manifest (as YAML or JSON)",
  default: "./mstudio-extension.yaml",
});

export async function parseExtensionManifest(
  filename: string,
): Promise<ExtensionManifest> {
  const contents = await readFile(filename, { encoding: "utf-8" });
  return yaml.load(contents) as ExtensionManifest;
}
