import { loadInvocationProfiles } from "../config/loader.js";
import { DEFAULT_UUID } from "./config.js";
import type {
  ExampleCandidate,
  InteractiveSignal,
  InvocationProfile,
  ParsedArg,
  ParsedFlag,
  PlaceholderKind,
  ResolvedFlagValue,
  SynthesizedInvocation,
  ValueSource,
} from "./types.js";

export function resolveProfiles(commandId: string): InvocationProfile[] {
  const invocationProfiles = loadInvocationProfiles();
  return invocationProfiles.filter((profile) => {
    if (profile.match.exact && profile.match.exact === commandId) {
      return true;
    }

    if (
      profile.match.prefix &&
      commandId.startsWith(`${profile.match.prefix} `)
    ) {
      return true;
    }

    return false;
  });
}

export function synthesizeInvocation(input: {
  commandId: string;
  commandTokens: string[];
  parsedArgs: ParsedArg[];
  parsedFlags: ParsedFlag[];
  interactiveSignals: InteractiveSignal[];
  exampleCandidate: ExampleCandidate | undefined;
  profiles: InvocationProfile[];
}): SynthesizedInvocation {
  const {
    commandId,
    commandTokens,
    parsedArgs,
    parsedFlags,
    interactiveSignals,
    exampleCandidate,
    profiles,
  } = input;

  const staleExampleReasons: string[] = [];
  let validatedExample: ExampleCandidate | undefined;
  if (exampleCandidate) {
    const validationErrors = validateExampleCandidate(
      exampleCandidate,
      parsedArgs,
      parsedFlags,
    );
    if (validationErrors.length === 0) {
      validatedExample = exampleCandidate;
    } else {
      staleExampleReasons.push(
        ...validationErrors.map((reason) => `stale-example: ${reason}`),
      );
    }
  }

  const selectedFlags = new Map<string, ResolvedFlagValue>();
  let strongestSource: ValueSource = "heuristic";

  const positionalValues = parsedArgs.map((arg, index) => {
    const profileValue = getProfileArgValue(profiles, arg.name);
    if (profileValue !== undefined) {
      strongestSource = selectStrongerSource(strongestSource, "profile");
      return profileValue;
    }

    const exampleValue = validatedExample?.positionalValues[index];
    if (exampleValue !== undefined) {
      strongestSource = selectStrongerSource(strongestSource, "example");
      return exampleValue;
    }

    if (arg.defaultValue !== undefined) {
      return arg.defaultValue;
    }

    return defaultValueForPlaceholderKind(arg.placeholderKind, arg.name);
  });

  for (const flag of parsedFlags) {
    if (!flag.required) {
      continue;
    }

    const fromProfile = getProfileFlagValue(profiles, flag.name);
    if (fromProfile !== undefined) {
      setFlagValue(
        selectedFlags,
        flag.name,
        normalizeFlagValue(fromProfile),
        "profile",
      );
      strongestSource = selectStrongerSource(strongestSource, "profile");
      continue;
    }

    const fromExample = validatedExample?.flagValues.get(flag.name);
    if (fromExample && fromExample.length > 0) {
      setFlagValue(selectedFlags, flag.name, fromExample, "example");
      strongestSource = selectStrongerSource(strongestSource, "example");
      continue;
    }

    const heuristic = buildHeuristicFlagValue(flag);
    setFlagValue(selectedFlags, flag.name, heuristic, "heuristic");
  }

  resolveExactlyOneGroups(
    commandId,
    parsedFlags,
    selectedFlags,
    profiles,
    interactiveSignals,
  );
  resolveDependencies(parsedFlags, selectedFlags, profiles);
  resolveExclusiveGroups(parsedFlags, selectedFlags);
  applyProfileOverrides(parsedFlags, selectedFlags, profiles);
  const interactiveDecision = decideInteractivePolicy(
    commandId,
    parsedFlags,
    selectedFlags,
    interactiveSignals,
    profiles,
  );

  const invocation = renderInvocation(
    commandTokens,
    positionalValues,
    parsedFlags,
    selectedFlags,
  );
  return {
    args: invocation,
    argumentSource: strongestSource,
    interactiveDecision,
    staleExample: staleExampleReasons.length > 0,
    staleExampleReasons,
  };
}

function validateExampleCandidate(
  example: ExampleCandidate,
  argsSchema: ParsedArg[],
  flagSchema: ParsedFlag[],
): string[] {
  const errors: string[] = [];
  const flagNames = new Set(flagSchema.map((flag) => flag.name));

  for (const flagName of example.flagValues.keys()) {
    if (!flagNames.has(flagName)) {
      errors.push(`unknown flag --${flagName}`);
    }
  }

  const requiredArgsCount = argsSchema.filter((arg) => arg.required).length;
  if (example.positionalValues.length < requiredArgsCount) {
    errors.push("missing required positional arguments");
  }

  for (const flag of flagSchema) {
    if (flag.required && !example.flagValues.has(flag.name)) {
      errors.push(`missing required flag --${flag.name}`);
    }

    if (flag.dependsOn && example.flagValues.has(flag.name)) {
      for (const dependency of flag.dependsOn) {
        if (!example.flagValues.has(dependency)) {
          errors.push(`--${flag.name} depends on --${dependency}`);
        }
      }
    }

    if (flag.exclusive) {
      for (const conflicting of flag.exclusive) {
        if (
          example.flagValues.has(flag.name) &&
          example.flagValues.has(conflicting)
        ) {
          errors.push(`--${flag.name} is exclusive with --${conflicting}`);
        }
      }
    }
  }

  for (const group of collectExactlyOneGroups(flagSchema)) {
    const count = group.members.filter((name) =>
      example.flagValues.has(name),
    ).length;
    if (count !== 1) {
      errors.push(`exactly one of [${group.members.join(", ")}] must be set`);
    }
  }

  return errors;
}

function collectExactlyOneGroups(
  flagSchema: ParsedFlag[],
): Array<{ key: string; members: string[] }> {
  const groups = new Map<string, string[]>();

  for (const flag of flagSchema) {
    if (!flag.exactlyOne || flag.exactlyOne.length < 2) {
      continue;
    }

    const members = [...new Set(flag.exactlyOne)].sort();
    const key = members.join("|");
    groups.set(key, members);
  }

  return [...groups.entries()].map(([key, members]) => ({ key, members }));
}

function resolveExactlyOneGroups(
  commandId: string,
  flagSchema: ParsedFlag[],
  selectedFlags: Map<string, ResolvedFlagValue>,
  profiles: InvocationProfile[],
  interactiveSignals: InteractiveSignal[],
): void {
  for (const group of collectExactlyOneGroups(flagSchema)) {
    const selectedMembers = group.members.filter((member) =>
      selectedFlags.has(member),
    );

    if (selectedMembers.length === 1) {
      continue;
    }

    const preferredByProfile = getProfileExactlyOneChoice(profiles, group.key);
    if (preferredByProfile && group.members.includes(preferredByProfile)) {
      selectedFlags.set(preferredByProfile, {
        values: [
          makeTypedPlaceholderValue(preferredByProfile, "string", undefined),
        ],
        source: "profile",
      });
      for (const member of group.members) {
        if (member !== preferredByProfile) {
          selectedFlags.delete(member);
        }
      }
      continue;
    }

    const chosen = chooseExactlyOneMember(
      commandId,
      group.members,
      flagSchema,
      interactiveSignals,
    );

    const existing = selectedFlags.get(chosen);
    if (!existing) {
      selectedFlags.set(chosen, {
        values: [makeTypedPlaceholderValue(chosen, "string", undefined)],
        source: "heuristic",
      });
    }

    for (const member of group.members) {
      if (member !== chosen) {
        selectedFlags.delete(member);
      }
    }
  }
}

function chooseExactlyOneMember(
  commandId: string,
  members: string[],
  flagSchema: ParsedFlag[],
  interactiveSignals: InteractiveSignal[],
): string {
  if (members.includes("project-id")) {
    return "project-id";
  }

  const scored = members.map((member) => {
    const closure = dependencyClosureSize(member, flagSchema);
    const nonInteractiveBonus = scoreNonInteractiveMember(
      member,
      interactiveSignals,
    );
    return {
      member,
      score: closure - nonInteractiveBonus,
    };
  });

  scored.sort((a, b) => {
    if (a.score !== b.score) {
      return a.score - b.score;
    }

    return a.member.localeCompare(b.member);
  });

  return scored[0]?.member ?? members[0] ?? commandId;
}

function scoreNonInteractiveMember(
  member: string,
  interactiveSignals: InteractiveSignal[],
): number {
  if (member === "consent" && interactiveSignals.includes("addConfirmation")) {
    return 3;
  }

  if (member === "force" && interactiveSignals.includes("addConfirmation")) {
    return 3;
  }

  if (member === "password" && interactiveSignals.includes("addInput")) {
    return 3;
  }

  if (member === "override-type" && interactiveSignals.includes("addSelect")) {
    return 2;
  }

  return 0;
}

function dependencyClosureSize(
  member: string,
  flagSchema: ParsedFlag[],
): number {
  const visited = new Set<string>();

  const visit = (flagName: string): void => {
    if (visited.has(flagName)) {
      return;
    }

    visited.add(flagName);
    const flag = flagSchema.find((candidate) => candidate.name === flagName);
    for (const dependency of flag?.dependsOn ?? []) {
      visit(dependency);
    }
  };

  visit(member);
  return visited.size;
}

function resolveDependencies(
  flagSchema: ParsedFlag[],
  selectedFlags: Map<string, ResolvedFlagValue>,
  profiles: InvocationProfile[],
): void {
  let changed = true;

  while (changed) {
    changed = false;

    for (const flag of flagSchema) {
      if (!selectedFlags.has(flag.name)) {
        continue;
      }

      for (const dependency of flag.dependsOn ?? []) {
        if (selectedFlags.has(dependency)) {
          continue;
        }

        const dependencySpec = flagSchema.find(
          (candidate) => candidate.name === dependency,
        );
        const profileValue = getProfileFlagValue(profiles, dependency);
        if (profileValue !== undefined) {
          setFlagValue(
            selectedFlags,
            dependency,
            normalizeFlagValue(profileValue),
            "profile",
          );
          changed = true;
          continue;
        }

        if (!dependencySpec) {
          setFlagValue(selectedFlags, dependency, ["true"], "heuristic");
          changed = true;
          continue;
        }

        setFlagValue(
          selectedFlags,
          dependency,
          buildHeuristicFlagValue(dependencySpec),
          "heuristic",
        );
        changed = true;
      }
    }
  }
}

function resolveExclusiveGroups(
  flagSchema: ParsedFlag[],
  selectedFlags: Map<string, ResolvedFlagValue>,
): void {
  for (const flag of flagSchema) {
    const selected = selectedFlags.get(flag.name);
    if (!selected || !flag.exclusive) {
      continue;
    }

    for (const otherName of flag.exclusive) {
      const other = selectedFlags.get(otherName);
      if (!other) {
        continue;
      }

      if (compareSourcePrecedence(selected.source, other.source) >= 0) {
        selectedFlags.delete(otherName);
      } else {
        selectedFlags.delete(flag.name);
      }
    }
  }
}

function applyProfileOverrides(
  flagSchema: ParsedFlag[],
  selectedFlags: Map<string, ResolvedFlagValue>,
  profiles: InvocationProfile[],
): void {
  for (const profile of profiles) {
    for (const [flagName, profileValue] of Object.entries(
      profile.requiredFlagDefaults ?? {},
    )) {
      const spec = flagSchema.find((flag) => flag.name === flagName);
      if (!spec) {
        continue;
      }

      setFlagValue(
        selectedFlags,
        flagName,
        normalizeFlagValue(profileValue),
        "profile",
      );
    }
  }
}

function decideInteractivePolicy(
  commandId: string,
  flagSchema: ParsedFlag[],
  selectedFlags: Map<string, ResolvedFlagValue>,
  interactiveSignals: InteractiveSignal[],
  profiles: InvocationProfile[],
): "NON_INTERACTIVE_RESOLVED" | "INTERACTIVE_REQUIRED" {
  if (interactiveSignals.length === 0) {
    return "NON_INTERACTIVE_RESOLVED";
  }

  const policy = profiles.find(
    (profile) => profile.interactivePolicy,
  )?.interactivePolicy;
  if (policy === "classify") {
    return "INTERACTIVE_REQUIRED";
  }

  const unresolved = resolveInteractiveSignals(
    commandId,
    flagSchema,
    selectedFlags,
    interactiveSignals,
  );
  return unresolved.length === 0
    ? "NON_INTERACTIVE_RESOLVED"
    : "INTERACTIVE_REQUIRED";
}

function resolveInteractiveSignals(
  commandId: string,
  flagSchema: ParsedFlag[],
  selectedFlags: Map<string, ResolvedFlagValue>,
  interactiveSignals: InteractiveSignal[],
): InteractiveSignal[] {
  const unresolved: InteractiveSignal[] = [];

  const hasFlag = (name: string): boolean =>
    flagSchema.some((flag) => flag.name === name);

  for (const signal of interactiveSignals) {
    if (signal === "addConfirmation") {
      if (hasFlag("force")) {
        setFlagValue(selectedFlags, "force", ["true"], "heuristic");
        continue;
      }

      if (hasFlag("consent")) {
        setFlagValue(selectedFlags, "consent", ["true"], "heuristic");
        continue;
      }

      unresolved.push(signal);
      continue;
    }

    if (signal === "addInput") {
      if (hasFlag("password")) {
        setFlagValue(
          selectedFlags,
          "password",
          ["integration-password"],
          "heuristic",
        );
        continue;
      }

      if (hasFlag("user-password")) {
        setFlagValue(
          selectedFlags,
          "user-password",
          ["integration-password"],
          "heuristic",
        );
        continue;
      }

      unresolved.push(signal);
      continue;
    }

    if (signal === "addSelect") {
      // Commands like database mysql upgrade only require selection when no
      // explicit target version was provided.
      if (hasFlag("version") && selectedFlags.has("version")) {
        continue;
      }

      if (hasFlag("override-type")) {
        setFlagValue(selectedFlags, "override-type", ["auto"], "heuristic");
        continue;
      }

      unresolved.push(signal);
      continue;
    }

    unresolved.push(signal);
  }

  if (commandId === "login token") {
    return [...new Set([...unresolved, "addInput"])] as InteractiveSignal[];
  }

  return [...new Set(unresolved)];
}

function renderInvocation(
  commandTokens: string[],
  positionalValues: string[],
  parsedFlags: ParsedFlag[],
  selectedFlags: Map<string, ResolvedFlagValue>,
): string[] {
  const args = [...commandTokens, ...positionalValues];

  const orderedFlags = parsedFlags
    .filter((flag) => selectedFlags.has(flag.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const flag of orderedFlags) {
    const resolved = selectedFlags.get(flag.name);
    if (!resolved) {
      continue;
    }

    if (!flag.takesValue) {
      args.push(`--${flag.name}`);
      continue;
    }

    for (const value of resolved.values) {
      args.push(`--${flag.name}`);
      args.push(value);
    }
  }

  return args;
}

function setFlagValue(
  map: Map<string, ResolvedFlagValue>,
  flagName: string,
  values: string[],
  source: ValueSource,
): void {
  const existing = map.get(flagName);
  if (!existing) {
    map.set(flagName, { values, source });
    return;
  }

  if (compareSourcePrecedence(source, existing.source) >= 0) {
    map.set(flagName, { values, source });
  }
}

function normalizeFlagValue(value: string | boolean): string[] {
  if (typeof value === "boolean") {
    return [value ? "true" : "false"];
  }

  return [value];
}

function buildHeuristicFlagValue(flag: ParsedFlag): string[] {
  if (!flag.takesValue) {
    return ["true"];
  }

  if (flag.defaultValue !== undefined) {
    return [flag.defaultValue];
  }

  return [makeTypedPlaceholderValue(flag.name, flag.type, flag.options)];
}

function getProfileArgValue(
  profiles: InvocationProfile[],
  argName: string,
): string | undefined {
  for (const profile of profiles) {
    const value = profile.requiredArgDefaults?.[argName];
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

function getProfileFlagValue(
  profiles: InvocationProfile[],
  flagName: string,
): string | boolean | undefined {
  for (const profile of profiles) {
    const value = profile.requiredFlagDefaults?.[flagName];
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

function getProfileExactlyOneChoice(
  profiles: InvocationProfile[],
  groupKey: string,
): string | undefined {
  for (const profile of profiles) {
    const choice = profile.exactlyOneChoice?.[groupKey];
    if (choice !== undefined) {
      return choice;
    }
  }

  return undefined;
}

function compareSourcePrecedence(a: ValueSource, b: ValueSource): number {
  const precedence: Record<ValueSource, number> = {
    heuristic: 1,
    example: 2,
    profile: 3,
  };

  return precedence[a] - precedence[b];
}

function selectStrongerSource(
  current: ValueSource,
  candidate: ValueSource,
): ValueSource {
  return compareSourcePrecedence(candidate, current) >= 0 ? candidate : current;
}

function defaultValueForPlaceholderKind(
  kind: PlaceholderKind,
  name: string,
): string {
  if (kind === "uuid") {
    return DEFAULT_UUID;
  }

  if (kind === "email") {
    return "integration@example.com";
  }

  if (kind === "url") {
    return "https://example.com";
  }

  if (kind === "duration") {
    return "1h";
  }

  if (kind === "directory") {
    return "/tmp/mw-integration";
  }

  if (kind === "file") {
    return "/tmp/mw-integration.file";
  }

  if (kind === "password") {
    return "integration-password";
  }

  if (kind === "port") {
    return "12345";
  }

  return makeTypedPlaceholderValue(name, "string", undefined);
}

function makeTypedPlaceholderValue(
  name: string,
  _type: string,
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
    return DEFAULT_UUID;
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

  if (normalized.includes("password")) {
    return "integration-password";
  }

  if (normalized.includes("port")) {
    return "12345";
  }

  return normalized.length > 0 ? `example-${normalized}` : "example-value";
}
