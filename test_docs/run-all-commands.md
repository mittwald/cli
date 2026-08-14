# Run-All Commands Integration Runner

## Purpose
Run all discovered CLI commands in integration context, emit deterministic
machine logs, and fail on all non-waived command failures.

This is the enforcement surface for command-matrix health.

## Implementation Scope

Primary entrypoint:

- `src/test/integration/run-all-commands.test.ts`

Supporting modules:

- `src/test/integration/command-discovery.ts`
- `src/test/integration/run-all-commands/overrides.ts`
- `src/test/integration/run-all-commands/helpers.ts`
- `src/test/integration/run-all-commands/machine-log.ts`
- `src/test/integration/classification-catalog.ts`
- `src/test/integration/config/loader.ts`

Guardrail:

- This suite executes only when explicitly invoked with
  `--runTestsByPath src/test/integration/run-all-commands.test.ts`.

## Required Environment

Required variables:

- `MITTWALD_API_TOKEN`
- `MITTWALD_API_BASE_URL`
- `MW_TEST_PROJECT_ID`

If any required variable is missing, the test fails at startup.

## Optional Runtime Controls

- `MW_TEST_MACHINE_LOG_PATH`
  - NDJSON output path
  - Default: `run-all-commands.ndjson` in repo root
- `MW_TEST_CATEGORY`
  - Restrict execution to command IDs in classification catalog for one category
- `MW_TEST_CLASSIFICATION_CATALOG_PATH`
  - Override catalog path used by category filtering
- `MW_TEST_COMMAND_ID`
  - Run exactly one discovered command
  - Waiver is bypassed for that command
- `MW_TEST_COMMAND_INVOCATION_ARGS`
  - JSON array of strings replacing synthesized invocation args
  - Requires `MW_TEST_COMMAND_ID`

## Operational Modes

### Full Matrix Mode

Condition:

- No `MW_TEST_CATEGORY`
- No `MW_TEST_COMMAND_ID`

Behavior:

- Discover all runnable commands
- Enforce strict waiver integrity checks
- Apply waivers
- Execute non-waived commands
- Write classification catalog from run summary buckets

### Category Campaign Mode

Condition:

- `MW_TEST_CATEGORY` set

Behavior:

- Discover all commands, then filter using classification catalog entries
- Disable waiver application for selected commands
- Skip strict global waiver integrity checks
- Skip classification catalog write

Use case:

- Work down one failure class (for example `RESOURCE_PRECONDITION`) end-to-end.

### Single-Command Hunting Mode

Condition:

- `MW_TEST_COMMAND_ID` set

Behavior:

- Select exactly one discovered command
- Bypass waiver for that command
- Optionally override invocation args with
  `MW_TEST_COMMAND_INVOCATION_ARGS`
- Skip strict global waiver integrity checks
- Skip classification catalog write

Use case:

- Reproduce and fix one hard command without matrix noise.

## Execution Runbooks

### Full Matrix Run

Fish:

```fish
env MITTWALD_API_TOKEN="<token>" \
    MITTWALD_API_BASE_URL="<base-url>" \
    MW_TEST_PROJECT_ID="<project-id>" \
    yarn test --runTestsByPath src/test/integration/run-all-commands.test.ts
```

Bash/Zsh:

```bash
MITTWALD_API_TOKEN="<token>" \
MITTWALD_API_BASE_URL="<base-url>" \
MW_TEST_PROJECT_ID="<project-id>" \
yarn test --runTestsByPath src/test/integration/run-all-commands.test.ts
```

### Category Campaign Run

```bash
MITTWALD_API_TOKEN="<token>" \
MITTWALD_API_BASE_URL="<base-url>" \
MW_TEST_PROJECT_ID="<project-id>" \
MW_TEST_CATEGORY="RESOURCE_PRECONDITION" \
yarn test --runTestsByPath src/test/integration/run-all-commands.test.ts
```

Optional custom catalog:

```bash
MITTWALD_API_TOKEN="<token>" \
MITTWALD_API_BASE_URL="<base-url>" \
MW_TEST_PROJECT_ID="<project-id>" \
MW_TEST_CATEGORY="RESOURCE_PRECONDITION" \
MW_TEST_CLASSIFICATION_CATALOG_PATH="./src/test/integration/config/command-classifications.json" \
yarn test --runTestsByPath src/test/integration/run-all-commands.test.ts
```

### Single-Command Run (Waiver Bypass)

```bash
MITTWALD_API_TOKEN="<token>" \
MITTWALD_API_BASE_URL="<base-url>" \
MW_TEST_PROJECT_ID="<project-id>" \
MW_TEST_COMMAND_ID="container logs" \
yarn test --runTestsByPath src/test/integration/run-all-commands.test.ts
```

With explicit invocation override:

```bash
MITTWALD_API_TOKEN="<token>" \
MITTWALD_API_BASE_URL="<base-url>" \
MW_TEST_PROJECT_ID="<project-id>" \
MW_TEST_COMMAND_ID="container logs" \
MW_TEST_COMMAND_INVOCATION_ARGS='["container","logs","--container-id","abc123","--tail","20"]' \
yarn test --runTestsByPath src/test/integration/run-all-commands.test.ts
```

## Runtime Behavior and Enforcement

### Discovery and Invocation

- Command IDs derive from file paths under `src/commands`.
- Invocation synthesis combines parsed args/flags, profiles, and examples.
- A command can be preflight-failed as `ARG_MISUSE` before execution if
  required args/flags are unresolved.

### Waiver and Integrity Logic

Always enforced by loader:

- No duplicate waiver IDs
- No duplicate waiver `commandId`

Strictly enforced only in full mode:

- No stale waiver references to non-discovered commands

Special enforcement:

- If a command is statically classified `INTERACTIVE_REQUIRED` and no waiver is
  present (and waiver bypass is not active), this is treated as a failure and
  infrastructure governance violation.

### Command Result Statuses

- `succeeded`
- `failed`
- `waived`
- `spawn-error`

Timeout behavior:

- Command process timeout is `30000ms` per command.
- Timeout is categorized as `COMMAND_BUG`.

## Outputs

Always produced:

- NDJSON machine log with `run-start`, `command-start`, `command-result`,
  `run-summary`

Produced only in full mode:

- Updated `src/test/integration/config/command-classifications.json`

## Failure Handling Playbook

1. Run in single-command mode for the failing command.
2. If needed, add `MW_TEST_COMMAND_INVOCATION_ARGS` to stabilize reproduction.
3. Decide fix path:
   - command implementation change
   - invocation profile change
   - fixture/precondition change
   - waiver addition/update (if fix not in scope)
4. Re-run single command until category and behavior are stable.
5. Re-run category campaign or full matrix to validate no regressions.

## Maintainer Notes

- Keep command IDs stable when moving/renaming command files.
- Preserve machine log payload fields used by downstream analyzers.
- If synthesis behavior changes, verify override semantics still replace args
  exactly for command override mode.
