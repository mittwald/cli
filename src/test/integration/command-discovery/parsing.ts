import {
  NAMED_FLAG_SCHEMAS,
  SHARED_ARG_SCHEMAS,
  SHARED_FLAG_SCHEMAS,
} from "./config.js";
import type {
  ExampleCandidate,
  FlagValueType,
  InteractiveSignal,
  ParsedArg,
  ParsedFlag,
  PlaceholderKind,
} from "./types.js";

export function extractExampleCandidate(
  source: string,
  commandId: string,
): ExampleCandidate | undefined {
  const examplesMatch = source.match(
    /static\s+examples\s*=\s*\[([\s\S]*?)\];/m,
  );
  if (!examplesMatch) {
    return undefined;
  }

  const block = examplesMatch[1];
  const commandStrings: string[] = [];

  const objectCommandRegex =
    /command\s*:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[\s\S]*?`)/g;

  let objectMatch = objectCommandRegex.exec(block);
  while (objectMatch) {
    const decoded = decodeStringLiteral(objectMatch[1]);
    if (decoded) {
      commandStrings.push(decoded);
    }

    objectMatch = objectCommandRegex.exec(block);
  }

  if (commandStrings.length === 0) {
    const stringLiteralRegex =
      /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[\s\S]*?`)/g;
    let stringMatch = stringLiteralRegex.exec(block);
    while (stringMatch) {
      const decoded = decodeStringLiteral(stringMatch[1]);
      if (
        decoded &&
        (decoded.includes("<%= command.id %>") || decoded.includes("mw "))
      ) {
        commandStrings.push(decoded);
      }

      stringMatch = stringLiteralRegex.exec(block);
    }
  }

  for (const commandString of commandStrings) {
    const args = parseExampleCommandToArgs(commandString, commandId);
    if (!args) {
      continue;
    }

    const { positionalValues, flagValues } = parseInvocationParts(
      args.slice(commandId.split(" ").length),
    );
    return {
      args,
      positionalValues,
      flagValues,
    };
  }

  return undefined;
}

export function extractArgsSchema(
  source: string,
  diagnostics: string[],
): ParsedArg[] {
  const block = extractStaticObjectBlock(source, /static\s+args\s*=\s*{/m);
  if (!block) {
    return [];
  }

  const entries = splitTopLevelEntries(block);
  const args = new Map<string, ParsedArg>();

  for (const entry of entries) {
    const spread = entry.match(/^\.\.\.\s*([A-Za-z0-9_$.]+)\s*$/);
    if (spread) {
      const spreadName = spread[1].split(".").at(-1) ?? spread[1];
      const sharedArgs = SHARED_ARG_SCHEMAS[spreadName];
      if (sharedArgs) {
        for (const sharedArg of sharedArgs) {
          args.set(sharedArg.name, sharedArg);
        }
        continue;
      }

      const localArgs = parseLocalArgObject(source, spreadName, diagnostics);
      if (localArgs.length > 0) {
        for (const localArg of localArgs) {
          args.set(localArg.name, localArg);
        }
        continue;
      }

      diagnostics.push(`args: unresolved spread '${spread[1]}'`);
      continue;
    }

    const split = splitObjectEntry(entry);
    if (!split) {
      continue;
    }

    const config = extractFirstObjectLiteral(split.expression);
    const required = readBooleanProp(config, "required") ?? false;
    const defaultValue = readStringProp(config, "default");

    args.set(split.key, {
      name: split.key,
      required,
      defaultValue,
      placeholderKind: inferPlaceholderKind(split.key),
    });
  }

  if (args.size === 0) {
    diagnostics.push("args: no statically extractable arg entries");
  }

  return [...args.values()];
}

export function extractFlagsSchema(
  source: string,
  diagnostics: string[],
): ParsedFlag[] {
  const block = extractStaticObjectBlock(source, /static\s+flags\s*=\s*{/m);
  if (!block) {
    diagnostics.push("flags: static flags block not found");
    return [];
  }

  const entries = splitTopLevelEntries(block);
  const flags = new Map<string, ParsedFlag>();

  for (const entry of entries) {
    const factorySpreadFlags = parseFlagSpreadFactory(entry);
    if (factorySpreadFlags.length > 0) {
      for (const flag of factorySpreadFlags) {
        flags.set(flag.name, flag);
      }
      continue;
    }

    const spread = entry.match(/^\.\.\.\s*([A-Za-z0-9_$.]+)\s*$/);
    if (spread) {
      const spreadName = spread[1].split(".").at(-1) ?? spread[1];
      const shared = SHARED_FLAG_SCHEMAS[spreadName];
      if (shared) {
        for (const flag of shared) {
          flags.set(flag.name, flag);
        }
        continue;
      }

      const localFlags = parseLocalFlagObject(source, spreadName, diagnostics);
      if (localFlags.length > 0) {
        for (const localFlag of localFlags) {
          flags.set(localFlag.name, localFlag);
        }
        continue;
      }

      diagnostics.push(`flags: unresolved spread '${spread[1]}'`);
      continue;
    }

    const split = splitObjectEntry(entry);
    if (!split) {
      diagnostics.push(
        `flags: could not parse entry '${entry.trim().slice(0, 80)}'`,
      );
      continue;
    }

    const parsedFlag = parseFlagDefinition(split.key, split.expression);
    if (!parsedFlag) {
      diagnostics.push(`flags: unresolved factory for '${split.key}'`);
      continue;
    }

    flags.set(parsedFlag.name, parsedFlag);
  }

  return [...flags.values()];
}

export function detectInteractiveSignals(source: string): InteractiveSignal[] {
  const signals: InteractiveSignal[] = [];
  const withSignal = (signal: InteractiveSignal, regex: RegExp) => {
    if (regex.test(source)) {
      signals.push(signal);
    }
  };

  withSignal("addInput", /\.addInput\s*\(/);
  withSignal("addSelect", /\.addSelect\s*\(/);
  withSignal("addConfirmation", /\.addConfirmation\s*\(/);
  withSignal("editorFallback", /editor|openEditor/i);
  withSignal("stdinBranch", /stdin|process\.stdin/i);

  return [...new Set(signals)];
}

function parseFlagSpreadFactory(entry: string): ParsedFlag[] {
  const expireFlagsMatch = entry.match(
    /^\.\.\.\s*expireFlags\(\s*[^,]+,\s*(true|false)\s*\)\s*$/,
  );

  if (expireFlagsMatch) {
    return [
      {
        name: "expires",
        required: expireFlagsMatch[1] === "true",
        type: "string",
        takesValue: true,
      },
    ];
  }

  return [];
}

function parseLocalArgObject(
  source: string,
  objectName: string,
  diagnostics: string[],
): ParsedArg[] {
  const block = extractConstObjectBlock(source, objectName);
  if (!block) {
    return [];
  }

  const entries = splitTopLevelEntries(block);
  const args = new Map<string, ParsedArg>();

  for (const entry of entries) {
    const spread = entry.match(/^\.\.\.\s*([A-Za-z0-9_$.]+)\s*$/);
    if (spread) {
      const spreadName = spread[1].split(".").at(-1) ?? spread[1];
      const shared = SHARED_ARG_SCHEMAS[spreadName];
      if (shared) {
        for (const sharedArg of shared) {
          args.set(sharedArg.name, sharedArg);
        }
      }
      continue;
    }

    const split = splitObjectEntry(entry);
    if (!split) {
      continue;
    }

    const config = extractFirstObjectLiteral(split.expression);
    const required = readBooleanProp(config, "required") ?? false;
    const defaultValue = readStringProp(config, "default");

    args.set(split.key, {
      name: split.key,
      required,
      defaultValue,
      placeholderKind: inferPlaceholderKind(split.key),
    });
  }

  if (args.size === 0) {
    diagnostics.push(
      `args: local spread '${objectName}' contained no extractable args`,
    );
  }

  return [...args.values()];
}

function parseLocalFlagObject(
  source: string,
  objectName: string,
  diagnostics: string[],
): ParsedFlag[] {
  const block = extractConstObjectBlock(source, objectName);
  if (!block) {
    return [];
  }

  const entries = splitTopLevelEntries(block);
  const flags = new Map<string, ParsedFlag>();

  for (const entry of entries) {
    const spread = entry.match(/^\.\.\.\s*([A-Za-z0-9_$.]+)\s*$/);
    if (spread) {
      continue;
    }

    const split = splitObjectEntry(entry);
    if (!split) {
      continue;
    }

    const parsed = parseFlagDefinition(split.key, split.expression);
    if (parsed) {
      flags.set(parsed.name, parsed);
    }
  }

  if (flags.size === 0) {
    diagnostics.push(
      `flags: local spread '${objectName}' contained no extractable flags`,
    );
  }

  return [...flags.values()];
}

function parseExampleCommandToArgs(
  example: string,
  commandId: string,
): string[] | undefined {
  const rendered = example
    .replace(/<%=\s*config\.bin\s*%>/g, "mw")
    .replace(/<%=\s*command\.id\s*%>/g, commandId);

  const commandLine = rendered
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .find((line) => line.includes(commandId) || line.startsWith("mw "));

  if (!commandLine) {
    return undefined;
  }

  const tokens = shellTokenize(commandLine.replace(/^\$\s*/, ""));
  const normalizedTokens = tokens.filter((token) => token !== "mw");
  const commandTokens = commandId.split(" ");
  const commandStart = findTokenSequenceIndex(normalizedTokens, commandTokens);

  if (commandStart === -1) {
    return undefined;
  }

  const rawInvocation = normalizedTokens.slice(commandStart);
  return rawInvocation.map((token) => {
    if (token.startsWith("<") && token.endsWith(">")) {
      return makeTypedPlaceholderValue(token.slice(1, -1), "string", undefined);
    }

    return token;
  });
}

function findTokenSequenceIndex(haystack: string[], needle: string[]): number {
  if (needle.length === 0 || haystack.length < needle.length) {
    return -1;
  }

  for (let i = 0; i <= haystack.length - needle.length; i += 1) {
    const segment = haystack.slice(i, i + needle.length);
    if (segment.every((token, idx) => token === needle[idx])) {
      return i;
    }
  }

  return -1;
}

function decodeStringLiteral(value: string): string | undefined {
  const quote = value[0];
  if ((quote !== '"' && quote !== "'" && quote !== "`") || value.length < 2) {
    return undefined;
  }

  const inner = value.slice(1, -1);
  return inner
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\`/g, "`")
    .replace(/\\\\/g, "\\");
}

function shellTokenize(value: string): string[] {
  const matches = value.match(/"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|\S+/g);
  if (!matches) {
    return [];
  }

  return matches.map((token) => {
    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    ) {
      return token.slice(1, -1);
    }

    return token;
  });
}

function makeTypedPlaceholderValue(
  name: string,
  type: FlagValueType,
  options: string[] | undefined,
): string {
  if (options && options.length > 0) {
    return options[0];
  }

  const normalized = name
    .replace(/[<>[\]]/g, "")
    .replace(/[^A-Za-z0-9-]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .toLowerCase();

  if (
    normalized.includes("uuid") ||
    normalized.endsWith("id") ||
    normalized.includes("-id")
  ) {
    return "00000000-0000-4000-8000-000000000000";
  }

  if (normalized.includes("email")) {
    return "integration@example.com";
  }

  if (normalized.includes("url") || normalized.includes("uri")) {
    return "https://example.com";
  }

  if (
    normalized.includes("duration") ||
    normalized.includes("ttl") ||
    normalized.includes("interval")
  ) {
    return "1h";
  }

  if (normalized.includes("directory") || normalized.includes("path")) {
    return "/tmp/mw-integration";
  }

  if (type === "file") {
    return "/tmp/mw-integration.file";
  }

  if (type === "directory") {
    return "/tmp/mw-integration";
  }

  if (normalized.includes("password")) {
    return "integration-password";
  }

  if (normalized.includes("port")) {
    return "12345";
  }

  return normalized.length > 0 ? `example-${normalized}` : "example-value";
}

function extractStaticObjectBlock(
  source: string,
  anchor: RegExp,
): string | undefined {
  const match = anchor.exec(source);
  if (!match) {
    return undefined;
  }

  const start = source.indexOf("{", match.index);
  if (start === -1) {
    return undefined;
  }

  const end = findMatchingBraceIndex(source, start);
  if (end === -1) {
    return undefined;
  }

  return source.slice(start + 1, end);
}

function extractConstObjectBlock(
  source: string,
  objectName: string,
): string | undefined {
  const anchor = new RegExp(
    `(?:const|let|var)\\s+${escapeRegExp(objectName)}\\s*=\\s*{`,
    "m",
  );
  const match = anchor.exec(source);
  if (!match) {
    return undefined;
  }

  const start = source.indexOf("{", match.index);
  if (start === -1) {
    return undefined;
  }

  const end = findMatchingBraceIndex(source, start);
  if (end === -1) {
    return undefined;
  }

  return source.slice(start + 1, end);
}

function findMatchingBraceIndex(input: string, startIndex: number): number {
  let depth = 0;
  let quote: "'" | '"' | "`" | undefined;
  let escaped = false;

  for (let i = startIndex; i < input.length; i += 1) {
    const char = input[i];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = undefined;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}

function splitTopLevelEntries(input: string): string[] {
  const entries: string[] = [];
  let start = 0;
  let braceDepth = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  let quote: "'" | '"' | "`" | undefined;
  let escaped = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = undefined;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") {
      braceDepth += 1;
      continue;
    }

    if (char === "}") {
      braceDepth -= 1;
      continue;
    }

    if (char === "(") {
      parenDepth += 1;
      continue;
    }

    if (char === ")") {
      parenDepth -= 1;
      continue;
    }

    if (char === "[") {
      bracketDepth += 1;
      continue;
    }

    if (char === "]") {
      bracketDepth -= 1;
      continue;
    }

    if (
      char === "," &&
      braceDepth === 0 &&
      parenDepth === 0 &&
      bracketDepth === 0
    ) {
      const part = input.slice(start, i).trim();
      if (part.length > 0) {
        entries.push(part);
      }
      start = i + 1;
    }
  }

  const tail = input.slice(start).trim();
  if (tail.length > 0) {
    entries.push(tail);
  }

  return entries;
}

function splitObjectEntry(
  entry: string,
): { key: string; expression: string } | undefined {
  let quote: "'" | '"' | "`" | undefined;
  let escaped = false;
  let braceDepth = 0;
  let parenDepth = 0;
  let bracketDepth = 0;

  for (let i = 0; i < entry.length; i += 1) {
    const char = entry[i];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = undefined;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") {
      braceDepth += 1;
      continue;
    }

    if (char === "}") {
      braceDepth -= 1;
      continue;
    }

    if (char === "(") {
      parenDepth += 1;
      continue;
    }

    if (char === ")") {
      parenDepth -= 1;
      continue;
    }

    if (char === "[") {
      bracketDepth += 1;
      continue;
    }

    if (char === "]") {
      bracketDepth -= 1;
      continue;
    }

    if (
      char === ":" &&
      braceDepth === 0 &&
      parenDepth === 0 &&
      bracketDepth === 0
    ) {
      const keyRaw = entry.slice(0, i).trim();
      const expression = entry.slice(i + 1).trim();
      const key = keyRaw.replace(/^['"]/, "").replace(/['"]$/, "");
      if (!key || !expression) {
        return undefined;
      }

      return { key, expression };
    }
  }

  return undefined;
}

function parseFlagDefinition(
  name: string,
  expression: string,
): ParsedFlag | undefined {
  const named = resolveNamedFlagSchemaFromExpression(expression);
  if (named) {
    return {
      name,
      ...named,
    };
  }

  const type = detectFlagType(expression);
  if (!type) {
    return undefined;
  }

  const config = extractFirstObjectLiteral(expression);
  const required = readBooleanProp(config, "required") ?? false;
  const multiple = readBooleanProp(config, "multiple") ?? false;
  const options = readStringArrayProp(config, "options");
  const exactlyOne = readStringArrayProp(config, "exactlyOne");
  const exclusive = readStringArrayProp(config, "exclusive");
  const dependsOn = readStringArrayProp(config, "dependsOn");
  const defaultValue = readLiteralStringProp(config, "default");

  return {
    name,
    required,
    type,
    takesValue: type !== "boolean",
    multiple,
    options,
    defaultValue,
    exactlyOne,
    exclusive,
    dependsOn,
  };
}

function detectFlagType(expression: string): FlagValueType | undefined {
  if (/Flags\.boolean\s*\(/.test(expression)) {
    return "boolean";
  }

  if (/Flags\.integer\s*\(/.test(expression)) {
    return "integer";
  }

  if (/Flags\.file\s*\(/.test(expression)) {
    return "file";
  }

  if (/Flags\.directory\s*\(/.test(expression)) {
    return "directory";
  }

  if (/Flags\.url\s*\(/.test(expression)) {
    return "url";
  }

  if (/Flags\.(string|custom)\s*\(/.test(expression)) {
    return "string";
  }

  if (
    /\.absoluteFlag\s*\(/.test(expression) ||
    /\.relativeFlag\s*\(/.test(expression)
  ) {
    return "string";
  }

  // Fallback for wrapped/custom flag factories, e.g. `flagDefinitions.name({ required: true })`.
  if (/^[A-Za-z0-9_.$[\]"'-]+\s*\(/.test(expression)) {
    return "string";
  }

  return undefined;
}

function resolveNamedFlagSchemaFromExpression(
  expression: string,
): Omit<ParsedFlag, "name"> | undefined {
  const normalized = expression.trim().replace(/\(\s*\)$/, "");
  const candidate = normalized.split(".").at(-1) ?? normalized;
  return NAMED_FLAG_SCHEMAS[candidate];
}

function extractFirstObjectLiteral(expression: string): string {
  const start = expression.indexOf("{");
  if (start === -1) {
    return "";
  }

  const end = findMatchingBraceIndex(expression, start);
  if (end === -1) {
    return "";
  }

  return expression.slice(start, end + 1);
}

function readBooleanProp(config: string, key: string): boolean | undefined {
  if (!config) {
    return undefined;
  }

  const regex = new RegExp(`${escapeRegExp(key)}\\s*:\\s*(true|false)`);
  const match = config.match(regex);
  if (!match) {
    return undefined;
  }

  return match[1] === "true";
}

function readStringProp(config: string, key: string): string | undefined {
  if (!config) {
    return undefined;
  }

  const regex = new RegExp(`${escapeRegExp(key)}\\s*:\\s*(["'])(.*?)\\1`, "s");
  const match = config.match(regex);
  return match?.[2];
}

function readLiteralStringProp(
  config: string,
  key: string,
): string | undefined {
  const stringValue = readStringProp(config, key);
  if (stringValue !== undefined) {
    return stringValue;
  }

  const boolMatch = config.match(
    new RegExp(`${escapeRegExp(key)}\\s*:\\s*(true|false)`),
  );
  if (boolMatch) {
    return boolMatch[1];
  }

  const numberMatch = config.match(
    new RegExp(`${escapeRegExp(key)}\\s*:\\s*([0-9]+(?:\\.[0-9]+)?)`),
  );
  if (numberMatch) {
    return numberMatch[1];
  }

  return undefined;
}

function readStringArrayProp(
  config: string,
  key: string,
): string[] | undefined {
  if (!config) {
    return undefined;
  }

  const regex = new RegExp(`${escapeRegExp(key)}\\s*:\\s*\\[([^\\]]*)\\]`, "s");
  const match = config.match(regex);
  if (!match) {
    return undefined;
  }

  return match[1]
    .split(",")
    .map((entry) => entry.trim().replace(/^['"]/, "").replace(/['"]$/, ""))
    .filter((entry) => entry.length > 0);
}

function inferPlaceholderKind(name: string): PlaceholderKind {
  const normalized = name.toLowerCase();
  if (
    normalized.includes("uuid") ||
    normalized.endsWith("id") ||
    normalized.includes("-id")
  ) {
    return "uuid";
  }
  if (normalized.includes("email")) {
    return "email";
  }
  if (normalized.includes("url") || normalized.includes("uri")) {
    return "url";
  }
  if (
    normalized.includes("duration") ||
    normalized.includes("ttl") ||
    normalized.includes("interval")
  ) {
    return "duration";
  }
  if (normalized.includes("directory")) {
    return "directory";
  }
  if (normalized.includes("file")) {
    return "file";
  }
  if (
    normalized.includes("password") ||
    normalized.includes("passphrase") ||
    normalized.includes("token")
  ) {
    return "password";
  }
  if (normalized.includes("port")) {
    return "port";
  }
  return "generic";
}

function parseInvocationParts(args: string[]): {
  positionalValues: string[];
  flagValues: Map<string, string[]>;
} {
  const positionalValues: string[] = [];
  const flagValues = new Map<string, string[]>();

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (!token.startsWith("--")) {
      positionalValues.push(token);
      continue;
    }

    const withoutPrefix = token.slice(2);
    const eqIndex = withoutPrefix.indexOf("=");
    let name = withoutPrefix;
    let value: string | undefined;

    if (eqIndex >= 0) {
      name = withoutPrefix.slice(0, eqIndex);
      value = withoutPrefix.slice(eqIndex + 1);
    } else {
      const nextToken = args[i + 1];
      if (nextToken && !nextToken.startsWith("--")) {
        value = nextToken;
        i += 1;
      }
    }

    const values = flagValues.get(name) ?? [];
    if (value === undefined) {
      values.push("true");
    } else {
      values.push(value);
    }
    flagValues.set(name, values);
  }

  return { positionalValues, flagValues };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
