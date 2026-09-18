import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

type CommandReference = {
  commandId: string;
  sourceFile: string;
};

type FailureCategory =
  | "ARG_MISUSE"
  | "INTERACTIVE_REQUIRED"
  | "RESOURCE_PRECONDITION"
  | "CONTRACT_SHAPE"
  | "COMMAND_BUG"
  | "DEPRECATED_ENDPOINT";

type CliOptions = {
  machineLogPath?: string;
  category?: FailureCategory;
  openapiPath: string;
  outputJsonPath: string;
  outputMarkdownPath: string;
};

type NdjsonRecord = {
  timestamp?: string;
  event?: string;
  commandId?: string;
  sourceFile?: string;
  status?: string;
  failureCategory?: FailureCategory;
};

type CommandLogRecord = {
  status?: string;
  failureCategory?: FailureCategory;
};

type ApiCallUsage = {
  group: string;
  method: string;
  groupMethod: string;
  filePath: string;
};

type DescriptorMeta = {
  descriptorName: string;
  path: string | null;
  httpMethod: string | null;
  operationId: string | null;
};

type OpenApiOperation = {
  operationId: string | null;
  deprecated: boolean;
};

type ResolvedEndpoint = {
  groupMethod: string;
  descriptorName: string | null;
  descriptorPath: string | null;
  descriptorHttpMethod: string | null;
  descriptorOperationId: string | null;
  openapiOperationId: string | null;
  openapiDeprecated: boolean | null;
  openapiStatus:
    "FOUND" | "MISSING_PATH" | "MISSING_METHOD" | "MISSING_DESCRIPTOR";
};

type CommandMappingEntry = {
  commandId: string;
  sourceFile: string;
  transitiveFiles: string[];
  logStatus: string | null;
  logCategory: FailureCategory | null;
  apiCalls: ApiCallUsage[];
  resolvedEndpoints: ResolvedEndpoint[];
  unresolvedGroupMethods: string[];
};

type MappingOutput = {
  generatedAt: string;
  inputs: {
    machineLogPath: string | null;
    category: FailureCategory | null;
    openapiPath: string;
  };
  statistics: {
    commandCount: number;
    commandWithApiCalls: number;
    unresolvedGroupMethodCount: number;
    deprecatedEndpointCount: number;
  };
  entries: CommandMappingEntry[];
};

type FileImportBinding = {
  sourceFilePath: string;
  importedName: string;
};

type FunctionInfo = {
  localCalls: Set<string>;
  importedCalls: Map<string, FileImportBinding>;
  apiCalls: ApiCallUsage[];
};

type FileAnalysis = {
  imports: Map<string, FileImportBinding>;
  localFunctions: Map<string, ts.Node>;
  exports: Map<string, string>;
  functionInfos: Map<string, FunctionInfo>;
  rootInfo: FunctionInfo;
};

type TraversalState = {
  visitedFiles: Set<string>;
  visitedFunctions: Set<string>;
  apiCalls: ApiCallUsage[];
};

const DEFAULT_OPENAPI_PATH = "openapi.json";
const DEFAULT_OUTPUT_JSON_PATH = "command-endpoint-map.json";
const DEFAULT_OUTPUT_MARKDOWN_PATH = "command-endpoint-map.md";
const DEFAULT_MACHINE_LOG_PATH = "run-all-commands.ndjson";

function parseCliOptions(argv: string[]): CliOptions {
  const options: CliOptions = {
    openapiPath: DEFAULT_OPENAPI_PATH,
    outputJsonPath: DEFAULT_OUTPUT_JSON_PATH,
    outputMarkdownPath: DEFAULT_OUTPUT_MARKDOWN_PATH,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--machine-log") {
      options.machineLogPath = requireNextArg(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--category") {
      const raw = requireNextArg(argv, i, token);
      options.category = parseFailureCategory(raw);
      i += 1;
      continue;
    }

    if (token === "--openapi") {
      options.openapiPath = requireNextArg(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--output-json") {
      options.outputJsonPath = requireNextArg(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--output-md") {
      options.outputMarkdownPath = requireNextArg(argv, i, token);
      i += 1;
      continue;
    }

    if (token === "--help" || token === "-h") {
      printHelp();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  return options;
}

function requireNextArg(argv: string[], index: number, token: string): string {
  const value = argv[index + 1];
  if (!value) {
    throw new Error(`Missing value for ${token}`);
  }
  return value;
}

function parseFailureCategory(value: string): FailureCategory {
  const categories: FailureCategory[] = [
    "ARG_MISUSE",
    "INTERACTIVE_REQUIRED",
    "RESOURCE_PRECONDITION",
    "CONTRACT_SHAPE",
    "COMMAND_BUG",
    "DEPRECATED_ENDPOINT",
  ];

  if (!categories.includes(value as FailureCategory)) {
    throw new Error(
      `Invalid category '${value}'. Expected one of ${categories.join(", ")}`,
    );
  }

  return value as FailureCategory;
}

function printHelp(): void {
  process.stdout.write(
    "Usage:\n" +
      "  yarn tool:integration:generate-command-endpoint-map [options]\n\n" +
      "Options:\n" +
      `  --machine-log <path>   NDJSON log from run-all integration test (default: ${DEFAULT_MACHINE_LOG_PATH})\n` +
      "  --category <name>      Optional failure category filter\n" +
      `  --openapi <path>       OpenAPI JSON file (default: ${DEFAULT_OPENAPI_PATH})\n` +
      `  --output-json <path>   Output JSON mapping (default: ${DEFAULT_OUTPUT_JSON_PATH})\n` +
      `  --output-md <path>     Output markdown summary (default: ${DEFAULT_OUTPUT_MARKDOWN_PATH})\n` +
      "  -h, --help             Show this help\n",
  );
}

async function main(): Promise<void> {
  const options = parseCliOptions(process.argv);
  const openapiPath = path.resolve(options.openapiPath);
  const outputJsonPath = path.resolve(options.outputJsonPath);
  const outputMarkdownPath = path.resolve(options.outputMarkdownPath);

  const machineLogPath = path.resolve(
    options.machineLogPath ?? DEFAULT_MACHINE_LOG_PATH,
  );

  if (!fs.existsSync(machineLogPath)) {
    throw new Error(
      `Machine log not found at ${machineLogPath}. Run the integration command runner first to produce command-start and command-result events.`,
    );
  }

  const machineLogData = loadMachineLogData(machineLogPath);

  const filteredCommands = filterCommands(
    machineLogData.commands,
    machineLogData.commandLogById,
    options.category,
  );

  const groupMethodToDescriptor = buildGroupMethodToDescriptorIndex();
  const descriptorMetaByName = buildDescriptorMetaIndex();
  const openapi = JSON.parse(fs.readFileSync(openapiPath, "utf8")) as {
    paths?: Record<
      string,
      Record<string, { operationId?: string; deprecated?: boolean }>
    >;
  };

  const entries = filteredCommands.map((command) => {
    const sourceAbsPath = path.resolve(
      process.cwd(),
      "src/commands",
      command.sourceFile,
    );
    const analysis = analyzeCommandTransitive(sourceAbsPath);
    const uniqueApiCalls = deduplicateApiCalls(analysis.apiCalls);

    const resolvedEndpoints = resolveEndpoints(
      uniqueApiCalls,
      groupMethodToDescriptor,
      descriptorMetaByName,
      openapi,
    );

    const unresolvedGroupMethods = resolvedEndpoints
      .filter((endpoint) => endpoint.openapiStatus === "MISSING_DESCRIPTOR")
      .map((endpoint) => endpoint.groupMethod);

    const logRecord = machineLogData.commandLogById.get(command.commandId);

    return {
      commandId: command.commandId,
      sourceFile: command.sourceFile,
      transitiveFiles: Array.from(analysis.visitedFiles)
        .map((filePath) => path.relative(process.cwd(), filePath))
        .sort((a, b) => a.localeCompare(b)),
      logStatus: logRecord?.status ?? null,
      logCategory: logRecord?.failureCategory ?? null,
      apiCalls: uniqueApiCalls
        .map((call) => ({
          ...call,
          filePath: path.relative(process.cwd(), call.filePath),
        }))
        .sort((a, b) => {
          const methodCmp = a.groupMethod.localeCompare(b.groupMethod);
          return methodCmp !== 0
            ? methodCmp
            : a.filePath.localeCompare(b.filePath);
        }),
      resolvedEndpoints,
      unresolvedGroupMethods,
    } satisfies CommandMappingEntry;
  });

  const output: MappingOutput = {
    generatedAt: new Date().toISOString(),
    inputs: {
      machineLogPath: fs.existsSync(machineLogPath)
        ? path.relative(process.cwd(), machineLogPath)
        : null,
      category: options.category ?? null,
      openapiPath: path.relative(process.cwd(), openapiPath),
    },
    statistics: {
      commandCount: entries.length,
      commandWithApiCalls: entries.filter((entry) => entry.apiCalls.length > 0)
        .length,
      unresolvedGroupMethodCount: entries.reduce(
        (sum, entry) => sum + entry.unresolvedGroupMethods.length,
        0,
      ),
      deprecatedEndpointCount: entries.reduce(
        (sum, entry) =>
          sum +
          entry.resolvedEndpoints.filter(
            (endpoint) => endpoint.openapiDeprecated === true,
          ).length,
        0,
      ),
    },
    entries,
  };

  fs.writeFileSync(
    outputJsonPath,
    `${JSON.stringify(output, null, 2)}\n`,
    "utf8",
  );
  fs.writeFileSync(outputMarkdownPath, renderMarkdown(output), "utf8");

  process.stdout.write(
    `Wrote ${path.relative(process.cwd(), outputJsonPath)} and ${path.relative(process.cwd(), outputMarkdownPath)} for ${entries.length} commands.\n`,
  );
}

function loadMachineLogData(machineLogPath: string): {
  commands: CommandReference[];
  commandLogById: Map<string, CommandLogRecord>;
} {
  const lines = fs
    .readFileSync(machineLogPath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const commandLogById = new Map<string, CommandLogRecord>();
  const commandById = new Map<string, CommandReference>();

  for (let idx = 0; idx < lines.length; idx += 1) {
    const line = lines[idx];
    let parsed: NdjsonRecord;

    try {
      parsed = JSON.parse(line) as NdjsonRecord;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Invalid NDJSON at ${machineLogPath}:${idx + 1}: ${message}`,
        { cause: error },
      );
    }

    if (parsed.event === "command-start") {
      if (
        typeof parsed.commandId !== "string" ||
        typeof parsed.sourceFile !== "string"
      ) {
        continue;
      }

      if (!commandById.has(parsed.commandId)) {
        commandById.set(parsed.commandId, {
          commandId: parsed.commandId,
          sourceFile: parsed.sourceFile,
        });
      }
      continue;
    }

    if (parsed.event === "command-result") {
      if (typeof parsed.commandId !== "string") {
        continue;
      }

      commandLogById.set(parsed.commandId, {
        status: parsed.status,
        failureCategory: parsed.failureCategory,
      });
    }
  }

  const commands = Array.from(commandById.values()).sort((a, b) =>
    a.commandId.localeCompare(b.commandId),
  );

  if (commands.length === 0) {
    throw new Error(
      `No command-start entries with sourceFile found in ${machineLogPath}. Ensure run-all integration test writes discovery metadata to the machine log.`,
    );
  }

  return {
    commands,
    commandLogById,
  };
}

function filterCommands(
  commands: CommandReference[],
  commandLogById: Map<string, CommandLogRecord>,
  category: FailureCategory | undefined,
): CommandReference[] {
  if (!category) {
    return commands;
  }

  return commands.filter((command) => {
    const record = commandLogById.get(command.commandId);
    return record?.failureCategory === category;
  });
}

function buildGroupMethodToDescriptorIndex(): Map<string, string> {
  const clientPath = path.resolve(
    process.cwd(),
    "node_modules/@mittwald/api-client/dist/esm/generated/v2/client.js",
  );
  const sourceText = fs.readFileSync(clientPath, "utf8");
  const sourceFile = ts.createSourceFile(
    clientPath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );

  const index = new Map<string, string>();

  const visit = (node: ts.Node): void => {
    if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name)) {
      const methodName = node.name.text;
      const initializer = node.initializer;

      if (ts.isCallExpression(initializer)) {
        const maybeRequestFactory = initializer.expression;
        if (
          ts.isPropertyAccessExpression(maybeRequestFactory) &&
          maybeRequestFactory.name.text === "requestFunctionFactory" &&
          initializer.arguments.length === 1
        ) {
          const arg = initializer.arguments[0];
          if (
            ts.isPropertyAccessExpression(arg) &&
            ts.isIdentifier(arg.expression) &&
            arg.expression.text === "descriptors"
          ) {
            const descriptorName = arg.name.text;
            const groupName = getEnclosingGroupName(node);
            if (groupName) {
              index.set(`${groupName}.${methodName}`, descriptorName);
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return index;
}

function getEnclosingGroupName(node: ts.Node): string | null {
  const objectLiteral = node.parent;
  if (!ts.isObjectLiteralExpression(objectLiteral)) {
    return null;
  }

  const parent = objectLiteral.parent;

  if (ts.isPropertyAssignment(parent) && ts.isIdentifier(parent.name)) {
    return parent.name.text;
  }

  if (ts.isPropertyDeclaration(parent) && ts.isIdentifier(parent.name)) {
    return parent.name.text;
  }

  return null;
}

function buildDescriptorMetaIndex(): Map<string, DescriptorMeta> {
  const descriptorsPath = path.resolve(
    process.cwd(),
    "node_modules/@mittwald/api-client/dist/esm/generated/v2/descriptors.js",
  );

  const sourceText = fs.readFileSync(descriptorsPath, "utf8");
  const sourceFile = ts.createSourceFile(
    descriptorsPath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );

  const map = new Map<string, DescriptorMeta>();

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    const hasExport = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    );
    if (!hasExport) {
      continue;
    }

    for (const decl of statement.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || !decl.initializer) {
        continue;
      }

      const descriptorName = decl.name.text;
      if (!ts.isObjectLiteralExpression(decl.initializer)) {
        continue;
      }

      let apiPath: string | null = null;
      let httpMethod: string | null = null;
      let operationId: string | null = null;

      for (const prop of decl.initializer.properties) {
        if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name)) {
          continue;
        }

        const key = prop.name.text;
        const value = prop.initializer;

        if (key === "path" && ts.isStringLiteralLike(value)) {
          apiPath = value.text;
          continue;
        }

        if (key === "method" && ts.isStringLiteralLike(value)) {
          httpMethod = value.text;
          continue;
        }

        if (key === "operationId" && ts.isStringLiteralLike(value)) {
          operationId = value.text;
        }
      }

      map.set(descriptorName, {
        descriptorName,
        path: apiPath,
        httpMethod,
        operationId,
      });
    }
  }

  return map;
}

function analyzeCommandTransitive(commandFilePath: string): {
  visitedFiles: Set<string>;
  apiCalls: ApiCallUsage[];
} {
  const state: TraversalState = {
    visitedFiles: new Set<string>(),
    visitedFunctions: new Set<string>(),
    apiCalls: [],
  };

  traverseFile(commandFilePath, null, state);

  return {
    visitedFiles: state.visitedFiles,
    apiCalls: state.apiCalls,
  };
}

function traverseFile(
  filePath: string,
  exportToFollow: string | null,
  state: TraversalState,
): void {
  const normalizedPath = path.resolve(filePath);
  const fileCacheKey = normalizedPath;

  const analysis = analyzeFile(normalizedPath);
  state.visitedFiles.add(normalizedPath);

  if (exportToFollow === null) {
    enqueueFunctionInfo(analysis.rootInfo, normalizedPath, state);

    for (const localName of analysis.rootInfo.localCalls) {
      followLocalFunction(analysis, normalizedPath, localName, state);
    }

    for (const binding of analysis.rootInfo.importedCalls.values()) {
      followImportedBinding(binding, state);
    }

    return;
  }

  const localName = analysis.exports.get(exportToFollow);
  if (!localName) {
    return;
  }

  followLocalFunction(analysis, fileCacheKey, localName, state);
}

function followLocalFunction(
  analysis: FileAnalysis,
  filePath: string,
  localName: string,
  state: TraversalState,
): void {
  const key = `${filePath}::${localName}`;
  if (state.visitedFunctions.has(key)) {
    return;
  }
  state.visitedFunctions.add(key);

  const info = analysis.functionInfos.get(localName);
  if (!info) {
    return;
  }

  enqueueFunctionInfo(info, filePath, state);

  for (const nestedLocal of info.localCalls) {
    followLocalFunction(analysis, filePath, nestedLocal, state);
  }

  for (const binding of info.importedCalls.values()) {
    followImportedBinding(binding, state);
  }
}

function followImportedBinding(
  binding: FileImportBinding,
  state: TraversalState,
): void {
  if (binding.importedName === "*") {
    return;
  }

  traverseFile(binding.sourceFilePath, binding.importedName, state);
}

function enqueueFunctionInfo(
  info: FunctionInfo,
  filePath: string,
  state: TraversalState,
): void {
  for (const call of info.apiCalls) {
    state.apiCalls.push({ ...call, filePath });
  }
}

const fileAnalysisCache = new Map<string, FileAnalysis>();

function analyzeFile(filePath: string): FileAnalysis {
  const normalized = path.resolve(filePath);
  const cached = fileAnalysisCache.get(normalized);
  if (cached) {
    return cached;
  }

  const sourceText = fs.readFileSync(normalized, "utf8");
  const scriptKind = normalized.endsWith(".tsx")
    ? ts.ScriptKind.TSX
    : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(
    normalized,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    scriptKind,
  );

  const imports = new Map<string, FileImportBinding>();
  const localFunctions = new Map<string, ts.Node>();
  const exports = new Map<string, string>();

  for (const stmt of sourceFile.statements) {
    if (
      ts.isImportDeclaration(stmt) &&
      stmt.importClause &&
      ts.isStringLiteral(stmt.moduleSpecifier)
    ) {
      const moduleName = stmt.moduleSpecifier.text;
      const resolvedImport = resolveRelativeImport(normalized, moduleName);
      if (!resolvedImport) {
        continue;
      }

      if (stmt.importClause.name) {
        imports.set(stmt.importClause.name.text, {
          sourceFilePath: resolvedImport,
          importedName: "default",
        });
      }

      const bindings = stmt.importClause.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) {
        for (const specifier of bindings.elements) {
          const importedName = specifier.propertyName
            ? specifier.propertyName.text
            : specifier.name.text;
          imports.set(specifier.name.text, {
            sourceFilePath: resolvedImport,
            importedName,
          });
        }
      }

      if (bindings && ts.isNamespaceImport(bindings)) {
        imports.set(bindings.name.text, {
          sourceFilePath: resolvedImport,
          importedName: "*",
        });
      }
    }

    collectLocalAndExportedFunctions(stmt, localFunctions, exports);
  }

  const functionInfos = new Map<string, FunctionInfo>();
  for (const [name, node] of localFunctions.entries()) {
    functionInfos.set(name, extractFunctionInfo(node, imports));
  }

  const rootInfo = extractRootInfo(sourceFile, imports, localFunctions);

  const result: FileAnalysis = {
    imports,
    localFunctions,
    exports,
    functionInfos,
    rootInfo,
  };

  fileAnalysisCache.set(normalized, result);
  return result;
}

function collectLocalAndExportedFunctions(
  stmt: ts.Statement,
  localFunctions: Map<string, ts.Node>,
  exports: Map<string, string>,
): void {
  if (ts.isFunctionDeclaration(stmt) && stmt.name) {
    localFunctions.set(stmt.name.text, stmt);
    if (hasExportModifier(stmt)) {
      exports.set(stmt.name.text, stmt.name.text);
    }
    return;
  }

  if (ts.isVariableStatement(stmt)) {
    const isExport = hasExportModifier(stmt);

    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || !decl.initializer) {
        continue;
      }

      if (
        ts.isArrowFunction(decl.initializer) ||
        ts.isFunctionExpression(decl.initializer)
      ) {
        localFunctions.set(decl.name.text, decl.initializer);
        if (isExport) {
          exports.set(decl.name.text, decl.name.text);
        }
      }
    }
    return;
  }

  if (
    ts.isExportDeclaration(stmt) &&
    stmt.exportClause &&
    ts.isNamedExports(stmt.exportClause)
  ) {
    if (stmt.moduleSpecifier) {
      return;
    }

    for (const specifier of stmt.exportClause.elements) {
      const exportName = specifier.name.text;
      const localName = specifier.propertyName
        ? specifier.propertyName.text
        : exportName;
      exports.set(exportName, localName);
    }
    return;
  }

  if (ts.isExportAssignment(stmt) && ts.isIdentifier(stmt.expression)) {
    exports.set("default", stmt.expression.text);
  }
}

function hasExportModifier(node: ts.Node): boolean {
  const modifiers = ts.canHaveModifiers(node)
    ? ts.getModifiers(node)
    : undefined;
  return !!modifiers?.some(
    (modifier: ts.Modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
  );
}

function extractRootInfo(
  sourceFile: ts.SourceFile,
  imports: Map<string, FileImportBinding>,
  localFunctions: Map<string, ts.Node>,
): FunctionInfo {
  const localCalls = new Set<string>();
  const importedCalls = new Map<string, FileImportBinding>();
  const apiCalls: ApiCallUsage[] = [];

  const addCall = (group: string, method: string): void => {
    apiCalls.push({
      group,
      method,
      groupMethod: `${group}.${method}`,
      filePath: sourceFile.fileName,
    });
  };

  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node)) {
      const callTarget = extractApiClientCall(node.expression);
      if (callTarget) {
        addCall(callTarget.group, callTarget.method);
      }

      const callRefs = extractCallReferences(
        node.expression,
        imports,
        localFunctions,
      );
      for (const localName of callRefs.localCallNames) {
        localCalls.add(localName);
      }
      for (const [name, binding] of callRefs.importedCalls.entries()) {
        importedCalls.set(name, binding);
      }
    }

    ts.forEachChild(node, visit);
  };

  ts.forEachChild(sourceFile, visit);

  return {
    localCalls,
    importedCalls,
    apiCalls,
  };
}

function extractFunctionInfo(
  node: ts.Node,
  imports: Map<string, FileImportBinding>,
): FunctionInfo {
  const localCalls = new Set<string>();
  const importedCalls = new Map<string, FileImportBinding>();
  const apiCalls: ApiCallUsage[] = [];

  const enclosingFile = node.getSourceFile().fileName;

  const visit = (child: ts.Node): void => {
    if (ts.isCallExpression(child)) {
      const callTarget = extractApiClientCall(child.expression);
      if (callTarget) {
        apiCalls.push({
          group: callTarget.group,
          method: callTarget.method,
          groupMethod: `${callTarget.group}.${callTarget.method}`,
          filePath: enclosingFile,
        });
      }

      const callRefs = extractCallReferences(
        child.expression,
        imports,
        new Map(),
      );
      for (const localName of callRefs.localCallNames) {
        localCalls.add(localName);
      }
      for (const [name, binding] of callRefs.importedCalls.entries()) {
        importedCalls.set(name, binding);
      }
    }

    ts.forEachChild(child, visit);
  };

  ts.forEachChild(node, visit);

  return {
    localCalls,
    importedCalls,
    apiCalls,
  };
}

function extractCallReferences(
  expression: ts.Expression,
  imports: Map<string, FileImportBinding>,
  localFunctions: Map<string, ts.Node>,
): {
  localCallNames: Set<string>;
  importedCalls: Map<string, FileImportBinding>;
} {
  const localCallNames = new Set<string>();
  const importedCalls = new Map<string, FileImportBinding>();

  if (ts.isIdentifier(expression)) {
    const name = expression.text;
    const binding = imports.get(name);
    if (binding) {
      importedCalls.set(name, binding);
    } else if (localFunctions.has(name)) {
      localCallNames.add(name);
    }
    return { localCallNames, importedCalls };
  }

  if (
    ts.isPropertyAccessExpression(expression) &&
    ts.isIdentifier(expression.expression)
  ) {
    const namespaceBinding = imports.get(expression.expression.text);
    if (namespaceBinding && namespaceBinding.importedName === "*") {
      importedCalls.set(
        `${expression.expression.text}.${expression.name.text}`,
        {
          sourceFilePath: namespaceBinding.sourceFilePath,
          importedName: expression.name.text,
        },
      );
    }
  }

  return { localCallNames, importedCalls };
}

function extractApiClientCall(
  expression: ts.Expression,
): { group: string; method: string } | null {
  const parts = flattenPropertyAccess(expression);
  if (!parts || parts.length < 3) {
    return null;
  }

  const apiClientIndex = parts.indexOf("apiClient");
  if (apiClientIndex >= 0 && parts.length >= apiClientIndex + 3) {
    return {
      group: parts[apiClientIndex + 1],
      method: parts[apiClientIndex + 2],
    };
  }

  const first = parts[0];
  if ((first === "apiClient" || first === "client") && parts.length >= 3) {
    return {
      group: parts[1],
      method: parts[2],
    };
  }

  return null;
}

function flattenPropertyAccess(expression: ts.Expression): string[] | null {
  if (expression.kind === ts.SyntaxKind.ThisKeyword) {
    return ["this"];
  }

  if (expression.kind === ts.SyntaxKind.SuperKeyword) {
    return ["super"];
  }

  if (ts.isIdentifier(expression)) {
    return [expression.text];
  }

  if (ts.isPropertyAccessExpression(expression)) {
    const left = flattenPropertyAccess(expression.expression);
    if (!left) {
      return null;
    }
    return [...left, expression.name.text];
  }

  if (
    ts.isElementAccessExpression(expression) &&
    ts.isStringLiteral(expression.argumentExpression)
  ) {
    const left = flattenPropertyAccess(expression.expression);
    if (!left) {
      return null;
    }
    return [...left, expression.argumentExpression.text];
  }

  return null;
}

function resolveRelativeImport(
  fromFilePath: string,
  specifier: string,
): string | null {
  if (!specifier.startsWith(".")) {
    return null;
  }

  const fromDir = path.dirname(fromFilePath);
  const base = path.resolve(fromDir, specifier);

  const candidates: string[] = [];
  const ext = path.extname(base);

  if (ext.length > 0) {
    candidates.push(base);
    if (ext === ".js" || ext === ".mjs" || ext === ".cjs") {
      candidates.push(base.slice(0, -ext.length) + ".ts");
      candidates.push(base.slice(0, -ext.length) + ".tsx");
    }
  } else {
    candidates.push(base + ".ts");
    candidates.push(base + ".tsx");
    candidates.push(path.join(base, "index.ts"));
    candidates.push(path.join(base, "index.tsx"));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

function deduplicateApiCalls(calls: ApiCallUsage[]): ApiCallUsage[] {
  const byKey = new Map<string, ApiCallUsage>();
  for (const call of calls) {
    const key = `${call.groupMethod}::${call.filePath}`;
    if (!byKey.has(key)) {
      byKey.set(key, call);
    }
  }
  return Array.from(byKey.values());
}

function resolveEndpoints(
  apiCalls: ApiCallUsage[],
  groupMethodToDescriptor: Map<string, string>,
  descriptorMetaByName: Map<string, DescriptorMeta>,
  openapi: {
    paths?: Record<
      string,
      Record<string, { operationId?: string; deprecated?: boolean }>
    >;
  },
): ResolvedEndpoint[] {
  return apiCalls.map((call) => {
    const descriptorName = groupMethodToDescriptor.get(call.groupMethod);

    if (!descriptorName) {
      return {
        groupMethod: call.groupMethod,
        descriptorName: null,
        descriptorPath: null,
        descriptorHttpMethod: null,
        descriptorOperationId: null,
        openapiOperationId: null,
        openapiDeprecated: null,
        openapiStatus: "MISSING_DESCRIPTOR",
      };
    }

    const descriptor = descriptorMetaByName.get(descriptorName);
    if (!descriptor || !descriptor.path || !descriptor.httpMethod) {
      return {
        groupMethod: call.groupMethod,
        descriptorName,
        descriptorPath: descriptor?.path ?? null,
        descriptorHttpMethod: descriptor?.httpMethod ?? null,
        descriptorOperationId: descriptor?.operationId ?? null,
        openapiOperationId: null,
        openapiDeprecated: null,
        openapiStatus: "MISSING_DESCRIPTOR",
      };
    }

    const operation = getOpenApiOperation(
      openapi,
      descriptor.path,
      descriptor.httpMethod,
    );

    return {
      groupMethod: call.groupMethod,
      descriptorName,
      descriptorPath: descriptor.path,
      descriptorHttpMethod: descriptor.httpMethod,
      descriptorOperationId: descriptor.operationId,
      openapiOperationId: operation?.operationId ?? null,
      openapiDeprecated: operation?.deprecated ?? null,
      openapiStatus: operation
        ? "FOUND"
        : openapi.paths?.[descriptor.path]
          ? "MISSING_METHOD"
          : "MISSING_PATH",
    };
  });
}

function getOpenApiOperation(
  openapi: {
    paths?: Record<
      string,
      Record<string, { operationId?: string; deprecated?: boolean }>
    >;
  },
  apiPath: string,
  httpMethod: string,
): OpenApiOperation | null {
  const pathItem = openapi.paths?.[apiPath];
  if (!pathItem) {
    return null;
  }

  const methodItem = pathItem[httpMethod.toLowerCase()];
  if (!methodItem) {
    return null;
  }

  return {
    operationId:
      typeof methodItem.operationId === "string"
        ? methodItem.operationId
        : null,
    deprecated: methodItem.deprecated === true,
  };
}

function renderMarkdown(output: MappingOutput): string {
  const lines: string[] = [];

  lines.push("# Command Endpoint Mapping");
  lines.push("");
  lines.push(`- Generated at: ${output.generatedAt}`);
  lines.push(`- Machine log: ${output.inputs.machineLogPath ?? "<none>"}`);
  lines.push(`- Category filter: ${output.inputs.category ?? "<none>"}`);
  lines.push(`- OpenAPI: ${output.inputs.openapiPath}`);
  lines.push("");

  lines.push("## Statistics");
  lines.push("");
  lines.push(`- Commands: ${output.statistics.commandCount}`);
  lines.push(
    `- Commands with API calls: ${output.statistics.commandWithApiCalls}`,
  );
  lines.push(
    `- Unresolved group methods: ${output.statistics.unresolvedGroupMethodCount}`,
  );
  lines.push(
    `- Deprecated endpoints: ${output.statistics.deprecatedEndpointCount}`,
  );
  lines.push("");

  for (const entry of output.entries) {
    lines.push(`## ${entry.commandId}`);
    lines.push("");
    lines.push(`- Source file: ${entry.sourceFile}`);
    lines.push(`- Log status: ${entry.logStatus ?? "<none>"}`);
    lines.push(`- Log category: ${entry.logCategory ?? "<none>"}`);

    lines.push("- Resolved endpoints:");
    if (entry.resolvedEndpoints.length === 0) {
      lines.push("  - <none>");
    } else {
      for (const endpoint of entry.resolvedEndpoints) {
        lines.push(
          `  - ${endpoint.groupMethod}: ${endpoint.descriptorHttpMethod ?? "<none>"} ${endpoint.descriptorPath ?? "<none>"} | descriptor=${endpoint.descriptorName ?? "<none>"} | openapi=${endpoint.openapiStatus} | deprecated=${endpoint.openapiDeprecated ?? "<none>"}`,
        );
      }
    }

    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

await main();
