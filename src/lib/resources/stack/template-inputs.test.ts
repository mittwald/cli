import { describe, it, expect, jest } from "@jest/globals";
import { collectTemplateUserInputs } from "./template-inputs.js";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { ProcessRenderer } from "../../../rendering/process/process.js";

type TemplateUserInputDefinition = NonNullable<
  MittwaldAPIV2.Components.Schemas.ContainerTemplate["userInputs"]
>[number];

function makeRenderer(inputAnswers: string[] = []): {
  renderer: ProcessRenderer;
  addInput: jest.Mock;
  addInfo: jest.Mock;
} {
  const answers = [...inputAnswers];
  const addInput = jest.fn(() => Promise.resolve(answers.shift() ?? ""));
  const addInfo = jest.fn();
  const renderer = { addInput, addInfo } as unknown as ProcessRenderer;
  return { renderer, addInput, addInfo };
}

describe("collectTemplateUserInputs", () => {
  it("uses provided values over defaults and prompts", async () => {
    const definitions: TemplateUserInputDefinition[] = [
      { name: "DOMAIN", required: true, defaultValue: "example.org" },
    ];
    const { renderer, addInput } = makeRenderer();

    const result = await collectTemplateUserInputs(
      definitions,
      { DOMAIN: "example.com" },
      renderer,
    );

    expect(result).toEqual([{ name: "DOMAIN", value: "example.com" }]);
    expect(addInput).not.toHaveBeenCalled();
  });

  it("falls back to the default value for required inputs", async () => {
    const definitions: TemplateUserInputDefinition[] = [
      { name: "PORT", required: true, defaultValue: "8080" },
    ];
    const { renderer, addInput } = makeRenderer();

    const result = await collectTemplateUserInputs(definitions, {}, renderer);

    expect(result).toEqual([{ name: "PORT", value: "8080" }]);
    expect(addInput).not.toHaveBeenCalled();
  });

  it("prompts for required inputs without a value or default", async () => {
    const definitions: TemplateUserInputDefinition[] = [
      {
        name: "ADMIN_EMAIL",
        required: true,
        label: { en: "Admin e-mail", de: "Admin-E-Mail" },
      },
    ];
    const { renderer, addInput } = makeRenderer(["admin@example.com"]);

    const result = await collectTemplateUserInputs(definitions, {}, renderer);

    expect(result).toEqual([
      { name: "ADMIN_EMAIL", value: "admin@example.com" },
    ]);
    expect(addInput).toHaveBeenCalledTimes(1);
  });

  it("omits optional inputs without a provided value", async () => {
    const definitions: TemplateUserInputDefinition[] = [
      { name: "OPTIONAL", required: false, defaultValue: "from-template" },
    ];
    const { renderer } = makeRenderer();

    const result = await collectTemplateUserInputs(definitions, {}, renderer);

    expect(result).toEqual([]);
  });

  it("warns about inputs that are not defined by the template", async () => {
    const definitions: TemplateUserInputDefinition[] = [
      { name: "KNOWN", required: false },
    ];
    const { renderer, addInfo } = makeRenderer();

    await collectTemplateUserInputs(
      definitions,
      { KNOWN: "a", UNKNOWN: "b" },
      renderer,
    );

    expect(addInfo).toHaveBeenCalledTimes(1);
    expect(addInfo).toHaveBeenCalledWith(expect.stringContaining("UNKNOWN"));
  });
});
