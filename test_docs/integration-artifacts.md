# Integration Artifacts and Contracts (Draft)

## Purpose
Define the artifact contract for run-all integration execution and downstream analysis tooling.

## Artifact Flow
1. Runner executes discovered commands.
2. Runner emits NDJSON machine log.
3. Runner emits/updates classification catalog (full runs only).
4. Analyzer consumes machine log records and command source/transitive analysis to map API usage to descriptors/OpenAPI operations.
5. Reports are generated as JSON and Markdown.

## Primary Artifacts
- run-all-commands.ndjson
- src/test/integration/config/command-classifications.json

Analyzer artifacts (generated only when analyzer tooling is executed):
- command-endpoint-map.json
- command-endpoint-map.md

## NDJSON Events
Expected event types:
- run-start
- command-start
- command-result
- run-summary

### command-start key fields
- commandId
- sourceFile
- commandTokens
- parsedArgs
- parsedFlags
- interactiveSignals
- invocationProfilesApplied
- extractionDiagnostics
- invocationArgs
- synthesizedInvocationArgs
- argumentSource
- interactiveDecision
- overrideApplied

### command-result key fields
- commandId
- status (succeeded | failed | waived | spawn-error)
- failureCategory (for failed)
- durationMs
- exitCode (when available)

## Classification Catalog Contract
File: src/test/integration/config/command-classifications.json

Key structure:
- schemaVersion
- generatedAt
- source
- statistics
- entries[] with:
  - commandId
  - category
  - source (failure | waiver | skip)

Note:
- Runner-generated catalogs currently contain failure and waiver entries.
- skip entries are supported by the catalog schema and log-extract helper.

## Category Filter Contract
When MW_TEST_CATEGORY is set:
- discovery still enumerates all commands
- execution list is filtered to command IDs from classification catalog entries matching category
- strict global waiver integrity checks are skipped for partial scope

## Single-Command Override Contract
When MW_TEST_COMMAND_ID is set:
- execution list contains only that command
- waiver is bypassed for that selected command
- strict global waiver integrity checks are skipped for partial scope
- if MW_TEST_COMMAND_INVOCATION_ARGS is set, it replaces synthesized invocation args

## Analyzer Tooling
Script entry points in package scripts:
- tool:integration:generate-command-endpoint-map
- tool:integration:generate-resource-precondition-map

Inputs:
- machine log NDJSON
- OpenAPI JSON

Outputs:
- endpoint map JSON
- endpoint map Markdown

## Failure Taxonomy
Canonical categories:
- ARG_MISUSE
- INTERACTIVE_REQUIRED
- RESOURCE_PRECONDITION
- CONTRACT_SHAPE
- COMMAND_BUG
- DEPRECATED_ENDPOINT

## Compatibility Guidance
If you modify runner payload fields:
1. Keep existing fields backward-compatible when possible.
2. Update analyzer expectations in lockstep.
3. Document contract changes in this file before merging.
