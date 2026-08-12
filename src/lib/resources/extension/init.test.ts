import { generateInitialExtensionManifest } from "./init.js";
import { describe, expect, it } from "@jest/globals";
import yaml from "js-yaml";
import * as uuid from "uuid";

describe(generateInitialExtensionManifest.name, () => {
  it("should generate valid YAML", () => {
    const generated = generateInitialExtensionManifest();
    const output = yaml.load(generated);

    expect(typeof output).toEqual("object");
  });

  it("should contain a random UUID", () => {
    const generated = generateInitialExtensionManifest();
    const output = yaml.load(generated);

    expect(output).toHaveProperty("id");
    expect(uuid.validate((output as any).id)).toBe(true);
  });
});
