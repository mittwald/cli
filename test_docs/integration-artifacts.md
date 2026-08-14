# Integration Artifacts and Contracts

## Purpose
This document defines the machine contracts for the run-all integration test and
the downstream analyzer tooling.

The intended one-way data flow is:

1. Integration runner executes discovered commands.
2. Runner writes machine events to NDJSON.
3. Runner writes/updates classification catalog on full runs.
4. Analyzer reads machine log + command source + OpenAPI.
5. Analyzer writes JSON + Markdown reports for triage.

## Artifact Inventory

Runner outputs:

- `run-all-commands.ndjson` (default path at repo root, configurable)
- `src/test/integration/config/command-classifications.json` (full runs only)

Analyzer outputs (on tool execution):

- `command-endpoint-map.json` (default path, configurable)
- `command-endpoint-map.md` (default path, configurable)

Analyzer inputs:

- NDJSON machine log (`--machine-log`, default `run-all-commands.ndjson`)
- OpenAPI JSON (`--openapi`, default `openapi.json`)

## NDJSON Event Contract

The runner appends JSON lines with an auto-added `timestamp` and an `event`
field.

Expected `event` values:

- `run-start`
- `command-start`
- `command-result`
- `run-summary`

### run-start

Contract fields:

- `categoryFilter: string | null`
- `classificationCatalogPath: string | null`
- `projectId: string`
- `commandCount: number`
- `waiverCount: number`
- `runtimeOverrides: { commandId?: string; invocationArgs?: string[] }`

### command-start

Contract fields:

- `index: number`
- `total: number`
- `position: string` (for example `12/338`)
- `commandId: string`
- `sourceFile: string` (relative to `src/commands`)
- `commandTokens: string[]`
- `parsedArgs: ParsedArg[]`
- `parsedFlags: ParsedFlag[]`
- `interactiveSignals: InteractiveSignal[]`
- `invocationProfilesApplied: string[]`
- `extractionDiagnostics: string[]`
- `invocationArgs: string[]` (effective args after overrides)
- `synthesizedInvocationArgs: string[]` (original synthesis)
- `argumentSource: "profile" | "example" | "heuristic"`
- `interactiveDecision: "NON_INTERACTIVE_RESOLVED" | "INTERACTIVE_REQUIRED"`
- `overrideApplied: boolean`

### command-result

Core fields:

- `index`, `total`, `position`, `commandId`, `durationMs`
- `status: "succeeded" | "failed" | "waived" | "spawn-error"`

Status-specific fields:

- `failed`: `failureCategory`, optionally `exitCode`, `stderr`, `stdout`,
  `timedOut`, `preflightIssues`, `details`
- `waived`: full `waiver` object
- `spawn-error`: `errorMessage`, optionally `stderr`, `stdout`
- `succeeded`: `exitCode`

### run-summary

Contract fields:

- `statistics: { successful, failed, waivedSkipped, total }`
- `failuresByCategory`
- `waivedByCategory`
- `infrastructureFailures: string[]`
- `runtimeOverrides`

## Classification Catalog Contract

File:

- `src/test/integration/config/command-classifications.json`

Schema:

- `schemaVersion: 1`
- `generatedAt: string` (ISO timestamp)
- `source: { kind: "run-all-summary" | "log-extract"; path?: string }`
- `statistics: { successful, failed, waivedSkipped, total }`
- `entries: Array<{ commandId, category, source }>`

Where:

- `category` is one of:
  `ARG_MISUSE | INTERACTIVE_REQUIRED | RESOURCE_PRECONDITION | CONTRACT_SHAPE | COMMAND_BUG | DEPRECATED_ENDPOINT`
- `source` is one of `failure | waiver | skip`

Behavior notes:

- Runner-generated catalog uses `buildClassificationCatalogFromBuckets` and
  emits `failure` and `waiver` entries.
- `skip` is supported by the schema and by log extraction tooling, but not
  emitted by the current runner flow.

## Filtering and Override Contracts

### Category Filter (`MW_TEST_CATEGORY`)

- Discovery still scans all command files.
- Final command set is filtered via catalog entries matching the category.
- Waiver application is disabled for this run scope.
- Strict global waiver integrity checks are skipped.
- Classification catalog write is skipped.

### Single Command Override (`MW_TEST_COMMAND_ID`)

- Final command set is exactly one discovered command.
- Waiver is bypassed for that selected command.
- Strict global waiver integrity checks are skipped.
- Classification catalog write is skipped.
- Optional `MW_TEST_COMMAND_INVOCATION_ARGS` replaces synthesized invocation
  args and must be a JSON array of strings.

## Analyzer Contract

Script entry points:

- `yarn tool:integration:generate-command-endpoint-map`
- `yarn tool:integration:generate-resource-precondition-map`

CLI options:

- `--machine-log <path>` (default `run-all-commands.ndjson`)
- `--category <name>` (optional category filter)
- `--openapi <path>` (default `openapi.json`)
- `--output-json <path>` (default `command-endpoint-map.json`)
- `--output-md <path>` (default `command-endpoint-map.md`)

Strict expectations:

- NDJSON must contain `command-start` with both `commandId` and `sourceFile`.
- NDJSON lines must parse as valid JSON.
- OpenAPI file must exist and parse as JSON.

## Backward Compatibility Rules

If you change any field in runner NDJSON payloads or classification catalog:

1. Keep existing fields backward-compatible whenever possible.
2. Update analyzer expectations in the same change.
3. Update this document in the same change.
