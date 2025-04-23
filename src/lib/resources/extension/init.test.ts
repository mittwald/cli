import { generateInitialExtensionManifest } from "./init.js";
import { describe, expect, it } from "@jest/globals";
import yaml from "js-yaml";

describe(generateInitialExtensionManifest.name, () => {
  it("should generate valid YAML", () => {
    const generated = generateInitialExtensionManifest();
    const output = yaml.load(generated);

    expect(typeof output).toEqual("object");
  });
});
