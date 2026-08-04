export type FlagValueType =
  "boolean" | "string" | "integer" | "file" | "directory" | "url" | "custom";

export type ValueSource = "profile" | "example" | "heuristic";

export type InteractiveSignal =
  | "addInput"
  | "addSelect"
  | "addConfirmation"
  | "editorFallback"
  | "stdinBranch";

export type PlaceholderKind =
  | "uuid"
  | "email"
  | "url"
  | "duration"
  | "file"
  | "directory"
  | "password"
  | "port"
  | "generic";

export type ParsedArg = {
  name: string;
  required: boolean;
  defaultValue?: string;
  placeholderKind: PlaceholderKind;
};

export type ParsedFlag = {
  name: string;
  required: boolean;
  type: FlagValueType;
  takesValue: boolean;
  options?: string[];
  multiple?: boolean;
  defaultValue?: string;
  exactlyOne?: string[];
  exclusive?: string[];
  dependsOn?: string[];
};

export type SynthesizedInvocation = {
  args: string[];
  argumentSource: ValueSource;
  interactiveDecision: "NON_INTERACTIVE_RESOLVED" | "INTERACTIVE_REQUIRED";
  staleExample: boolean;
  staleExampleReasons: string[];
};

export type DiscoveredCommand = {
  commandId: string;
  sourceFile: string;
  commandTokens: string[];
  parsedArgs: ParsedArg[];
  parsedFlags: ParsedFlag[];
  interactiveSignals: InteractiveSignal[];
  invocationProfilesApplied: string[];
  extractionDiagnostics: string[];
  synthesizedInvocation: SynthesizedInvocation;
};

export type ExampleCandidate = {
  args: string[];
  positionalValues: string[];
  flagValues: Map<string, string[]>;
};

export type ResolvedFlagValue = {
  values: string[];
  source: ValueSource;
};

export type InvocationProfile = {
  id: string;
  match: { exact?: string; prefix?: string };
  requiredFlagDefaults?: Record<string, string | boolean>;
  requiredArgDefaults?: Record<string, string>;
  exactlyOneChoice?: Record<string, string>;
  interactivePolicy?: "resolve" | "classify";
  disableExampleSource?: boolean;
  notes?: string;
};

export type WaiverCategory =
  | "ARG_MISUSE"
  | "INTERACTIVE_REQUIRED"
  | "RESOURCE_PRECONDITION"
  | "CONTRACT_SHAPE"
  | "COMMAND_BUG"
  | "DEPRECATED_ENDPOINT";

export type CommandWaiver = {
  id: string;
  commandId: string;
  category: WaiverCategory;
  reason: string;
  issue?: string;
  expiresOn?: string;
};
