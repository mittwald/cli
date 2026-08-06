# Run-All Commands Integration Runner (Draft)

## Purpose
In full-matrix mode, run every discovered CLI command once in an integration context, emit machine-readable NDJSON logs, and enforce that all non-waived failures are visible and actionable.

## Scope
This runner is implemented in:
- src/test/integration/run-all-commands.test.ts

Note:
- The suite is guarded and only runs when the file is invoked explicitly via --runTestsByPath.

It depends on:
- command discovery and invocation synthesis
- waiver configuration
- classification catalog generation

## Required Environment
The test requires:
- MITTWALD_API_TOKEN
- MITTWALD_API_BASE_URL
- MW_TEST_PROJECT_ID

## Optional Environment Controls
- MW_TEST_MACHINE_LOG_PATH
  - Path for NDJSON output (default: run-all-commands.ndjson in repo root)
- MW_TEST_CATEGORY
  - Restrict execution to command IDs listed in classification catalog for one category
- MW_TEST_CLASSIFICATION_CATALOG_PATH
  - Override catalog path used by category filtering
- MW_TEST_COMMAND_ID
  - Run only one discovered command ID
  - When set, waiver for that command is bypassed intentionally (waiver hunting mode)
- MW_TEST_COMMAND_INVOCATION_ARGS
  - JSON array of strings to fully override invocation args for MW_TEST_COMMAND_ID
  - Requires MW_TEST_COMMAND_ID

## Environment Variable Usage
All runtime controls are plain environment variables.

You can use them in two styles:
- one-off: prefix variables for a single command invocation
- session: export/set variables in shell state, run command, then unset

Example scenario used below:
- run a single command in waiver-hunting mode
- command ID: container logs

### Bash/Zsh Examples
One-off invocation:
```bash
MW_TEST_PROJECT_ID="<project-id>" \
MW_TEST_COMMAND_ID="container logs" \
yarn test --runTestsByPath src/test/integration/run-all-commands.test.ts
```

Session set, run, unset:
```bash
export MW_TEST_PROJECT_ID="<project-id>"
export MW_TEST_COMMAND_ID="container logs"
yarn test --runTestsByPath src/test/integration/run-all-commands.test.ts
unset MW_TEST_COMMAND_ID
unset MW_TEST_PROJECT_ID
```

### Fish Examples
One-off invocation:
```fish
env MW_TEST_PROJECT_ID="<project-id>" MW_TEST_COMMAND_ID="container logs" \
  yarn test --runTestsByPath src/test/integration/run-all-commands.test.ts
```

Session set, run, unset:
```fish
set -lx MW_TEST_PROJECT_ID "<project-id>"
set -lx MW_TEST_COMMAND_ID "container logs"
yarn test --runTestsByPath src/test/integration/run-all-commands.test.ts
set -e MW_TEST_COMMAND_ID
set -e MW_TEST_PROJECT_ID
```

Optional invocation-arg override in any shell:
```sh
MW_TEST_COMMAND_INVOCATION_ARGS='["container","logs","--container-id","abc123","--tail","20"]'
```

## Operating Principles
1. Discovery first: commands are discovered from src/commands, then synthesized args are built.
2. Waiver file validation is always strict:
  - duplicate waiver IDs fail
  - duplicate waiver command IDs fail
3. Full runs add a global consistency check:
  - waivers pointing to non-discovered commands fail
4. Command override mode skips the global waiver consistency check to enable focused debugging.
5. Category filter mode also skips the global waiver consistency check because execution scope is intentionally partial.
6. Non-waived failures fail the test and are surfaced with category and diagnostics.

## Outputs
- NDJSON machine log with run-start, command-start, command-result, run-summary
- Classification catalog file update during full runs without category or command override

## Notes for Maintainers
- Keep command IDs stable when refactoring command file paths.
- If invocation synthesis changes, verify MW_TEST_COMMAND_INVOCATION_ARGS still fully overrides run args.
- Preserve deterministic log fields consumed by downstream tooling.
