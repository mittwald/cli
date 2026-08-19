import type { FailureCategory } from "../classification-catalog.js";
import type {
	CommandWaiver,
	DiscoveredCommand,
} from "../command-discovery/types.js";

export type NonWaivedFailure = {
	commandId: string;
	kind: "failure" | "spawn-error";
	category?: FailureCategory;
	details: string;
};

export function classifyFailure(output: {
	stderr: string;
	stdout: string;
}): FailureCategory {
	const text = `${output.stderr}\n${output.stdout}`.toLowerCase();

	if (
		/missing\s+(?:\d+\s+)?required arg|missing\s+(?:\d+\s+)?required flag|exactly one of|required options|unexpected argument|unknown flag|nonexistent flag|invalid flag|flag .* expects|no .* id given|you need to specify at least one/i.test(
			text,
		)
	) {
		return "ARG_MISUSE";
	}

	if (
		/prompt|interactive|addinput|addselect|addconfirmation|overwrite\?|token file already exists|tty/i.test(
			text,
		)
	) {
		return "INTERACTIVE_REQUIRED";
	}

	if (
		/not found|does not exist|no .* found|resource.*missing|404|forbidden|unauthorized|no project found|failed to connect|could not resolve hostname|name or service not known|no main user found|main mysql user can not be deleted manually/i.test(
			text,
		)
	) {
		return "RESOURCE_PRECONDITION";
	}

	if (
		/invalid version|not iterable|cannot read properties|undefined.*data|validation|invalid type|schema/i.test(
			text,
		)
	) {
		return "CONTRACT_SHAPE";
	}

	return "COMMAND_BUG";
}

export function validateInvocationCompleteness(
	command: DiscoveredCommand,
	invocationArgs: string[],
): string[] {
	const issues: string[] = [];
	const { positionalValues, flagValues } = parseInvocationPartsFromArgs(
		invocationArgs,
		command.commandTokens.length,
	);

	command.parsedArgs.forEach((arg, index) => {
		if (!arg.required) {
			return;
		}

		if (positionalValues[index] === undefined) {
			issues.push(`missing required arg ${arg.name}`);
		}
	});

	for (const flag of command.parsedFlags) {
		if (flag.required && !flagValues.has(flag.name)) {
			issues.push(`missing required flag --${flag.name}`);
		}
	}

	const exactlyOneGroups = new Map<string, string[]>();
	for (const flag of command.parsedFlags) {
		if (!flag.exactlyOne || flag.exactlyOne.length < 2) {
			continue;
		}

		const members = [...new Set(flag.exactlyOne)].sort();
		exactlyOneGroups.set(members.join("|"), members);
	}

	for (const members of exactlyOneGroups.values()) {
		const selected = members.filter((member) => flagValues.has(member));
		if (selected.length !== 1) {
			issues.push(`exactly-one unresolved [${members.join(",")}]`);
		}
	}

	return issues;
}

export function mapCommandWaivers(waivers: CommandWaiver[]): {
	waiversByCommandId: Map<string, CommandWaiver>;
	duplicates: string[];
} {
	const waiversByCommandId = new Map<string, CommandWaiver>();
	const duplicates: string[] = [];

	for (const waiver of waivers) {
		if (waiversByCommandId.has(waiver.commandId)) {
			duplicates.push(waiver.commandId);
			continue;
		}

		waiversByCommandId.set(waiver.commandId, waiver);
	}

	return { waiversByCommandId, duplicates };
}

export function formatNonWaivedFailureSummary(
	failures: NonWaivedFailure[],
): string {
	if (failures.length === 0) {
		return "<none>";
	}

	return failures
		.map((failure) => {
			const base =
				failure.kind === "failure"
					? `${failure.commandId} [${failure.category}]`
					: `${failure.commandId} [spawn-error]`;
			return `${base}: ${failure.details}`;
		})
		.join("\n");
}

export function logBucketSummary(
	label: string,
	categories: FailureCategory[],
	buckets: Record<FailureCategory, string[]>,
	logProgress: (message: string) => void,
): void {
	logProgress(label);

	for (const category of categories) {
		const commands = buckets[category];
		const sample = commands.slice(0, 5).join(", ");
		logProgress(
			`[run-all]   ${category.padEnd(22, " ")} count=${String(commands.length).padStart(3, " ")} sample=${sample || "-"}`,
		);
	}
}

export function logCommandFailureOutput(
	position: string,
	commandId: string,
	result: { stdout: string; stderr: string },
	logProgress: (message: string) => void,
): void {
	logProgress(`[${position}] diagnostics ${commandId}: stderr >>>`);
	logProgress(formatOutputBlock(result.stderr));
	logProgress(`[${position}] diagnostics ${commandId}: stdout >>>`);
	logProgress(formatOutputBlock(result.stdout));
	logProgress(`[${position}] diagnostics ${commandId}: <<<`);
}

function parseInvocationPartsFromArgs(
	args: string[],
	commandTokenCount: number,
): { positionalValues: string[]; flagValues: Map<string, string[]> } {
	const positionalValues: string[] = [];
	const flagValues = new Map<string, string[]>();
	const invocationArgs = args.slice(commandTokenCount);

	for (let i = 0; i < invocationArgs.length; i += 1) {
		const token = invocationArgs[i];
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
			const nextToken = invocationArgs[i + 1];
			if (nextToken && !nextToken.startsWith("--")) {
				value = nextToken;
				i += 1;
			}
		}

		const values = flagValues.get(name) ?? [];
		values.push(value ?? "true");
		flagValues.set(name, values);
	}

	return { positionalValues, flagValues };
}

function formatOutputBlock(output: string): string {
	const trimmed = output.trim();
	return trimmed.length > 0 ? trimmed : "<empty>";
}
