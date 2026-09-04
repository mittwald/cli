import type { DiscoveredCommand } from "../command-discovery.js";

export type RunAllOverrides = {
	commandId?: string;
	invocationArgs?: string[];
};

export function loadRunAllOverrides(
	env: NodeJS.ProcessEnv = process.env,
): RunAllOverrides {
	const commandId = env.MW_TEST_COMMAND_ID?.trim() || undefined;
	const invocationArgsRaw = env.MW_TEST_COMMAND_INVOCATION_ARGS?.trim();
	const invocationArgs = invocationArgsRaw
		? parseInvocationArgs(invocationArgsRaw)
		: undefined;

	if (invocationArgs && !commandId) {
		throw new Error(
			"[run-all] MW_TEST_COMMAND_INVOCATION_ARGS requires MW_TEST_COMMAND_ID.",
		);
	}

	return {
		commandId,
		invocationArgs,
	};
}

export function applyCommandOverride(
	commands: DiscoveredCommand[],
	overrides: RunAllOverrides,
): DiscoveredCommand[] {
	if (!overrides.commandId) {
		return commands;
	}

	const selected = commands.find(
		(command) => command.commandId === overrides.commandId,
	);

	if (!selected) {
		throw new Error(
			[
				`[run-all] MW_TEST_COMMAND_ID '${overrides.commandId}' was not found in discovery output.`,
				"Discovered commands sample:",
				...commands.slice(0, 20).map((command) => `- ${command.commandId}`),
			].join("\n"),
		);
	}

	return [selected];
}

export function resolveInvocationArgs(
	command: DiscoveredCommand,
	overrides: RunAllOverrides,
): string[] {
	if (overrides.commandId === command.commandId && overrides.invocationArgs) {
		return overrides.invocationArgs;
	}

	return command.synthesizedInvocation.args;
}

export function shouldBypassWaiverForCommand(
	command: DiscoveredCommand,
	overrides: RunAllOverrides,
): boolean {
	return overrides.commandId === command.commandId;
}

function parseInvocationArgs(value: string): string[] {
	let parsed: unknown;

	try {
		parsed = JSON.parse(value);
	} catch (error) {
		throw new Error(
			`[run-all] MW_TEST_COMMAND_INVOCATION_ARGS must be valid JSON array: ${(error as Error).message}`,
			{ cause: error },
		);
	}

	if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "string")) {
		throw new Error(
			"[run-all] MW_TEST_COMMAND_INVOCATION_ARGS must be a JSON array of strings.",
		);
	}

	return [...parsed];
}
