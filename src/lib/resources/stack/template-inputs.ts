import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { ProcessRenderer } from "../../../rendering/process/process.js";

type ContainerTemplate = MittwaldAPIV2.Components.Schemas.ContainerTemplate;
type TemplateUserInputDefinition = NonNullable<
  ContainerTemplate["userInputs"]
>[number];

export interface TemplateUserInput {
  name: string;
  value: string;
}

/**
 * Determines whether an input holds a sensitive value, and should therefore be
 * masked when prompting for it. Templates mark these inputs with a validation
 * schema of format "password".
 */
export function isSensitiveInput(
  definition: TemplateUserInputDefinition,
): boolean {
  const { validationSchema } = definition;
  if (!validationSchema) {
    return false;
  }

  try {
    const parsed: unknown = JSON.parse(validationSchema);
    return (
      typeof parsed === "object" &&
      parsed !== null &&
      "format" in parsed &&
      parsed.format === "password"
    );
  } catch {
    return false;
  }
}

/**
 * Resolves the concrete user inputs that should be sent to the API when
 * creating a stack from a template.
 *
 * Values are resolved in the following order of precedence:
 *
 * 1. Values explicitly provided by the user (e.g. via `--input name=value`).
 * 2. For required inputs without a provided value: the template's default value
 *    (if present) or an interactive prompt.
 *
 * Optional inputs without a provided value are omitted entirely; the API fills
 * them from the template defaults.
 */
export async function collectTemplateUserInputs(
  definitions: TemplateUserInputDefinition[],
  providedInputs: Record<string, string>,
  renderer: ProcessRenderer,
): Promise<TemplateUserInput[]> {
  const knownNames = new Set(definitions.map((d) => d.name));
  for (const name of Object.keys(providedInputs)) {
    if (!knownNames.has(name)) {
      renderer.addInfo(
        `ignoring input '${name}', which is not defined by the template`,
      );
    }
  }

  const result: TemplateUserInput[] = [];

  for (const definition of definitions) {
    const providedValue = providedInputs[definition.name];
    if (providedValue !== undefined) {
      result.push({ name: definition.name, value: providedValue });
      continue;
    }

    // Optional inputs are filled from template defaults by the API.
    if (!definition.required) {
      continue;
    }

    if (definition.defaultValue !== undefined) {
      result.push({ name: definition.name, value: definition.defaultValue });
      continue;
    }

    const label = definition.label?.en;
    const suffix = label ? ` (${label})` : "";
    const value = await renderer.addInput(
      `enter value for required template input '${definition.name}'${suffix}`,
      isSensitiveInput(definition),
    );
    result.push({ name: definition.name, value });
  }

  return result;
}
