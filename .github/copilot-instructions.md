# Copilot Working Contract For Integration Analysis

This repository uses an artifact-first workflow for integration command triage.

## Non-negotiable Rules

- Operator instruction overrides all default agent behavior and heuristics. No
  exceptions.
- If operator intent is explicit, execute that intent directly. Do not
  substitute your own process preferences.
- Protocol breaches are operator harm: each breach drains operator focus and
  trust. Treat this as a critical failure condition.
- Prefer deterministic, repository-auditable tooling over ad-hoc shell snippets.
- Use TypeScript tools under `src/test/integration/tools/` for analysis
  workflows.
- Treat integration NDJSON logs as source of truth for command identity and
  outcomes.
- Do not rediscover command lists by scanning source files when NDJSON already
  contains `commandId` and `sourceFile`.
- Do not use regex heuristics to infer categories if `failureCategory` is
  present in machine logs.
- Fail fast on missing required artifact fields; do not silently degrade.
- Keep data flow one-way: producer test -> machine log -> analyzer -> reports.

## Integration Triage Pipeline

1. Run integration matrix and emit NDJSON events.
2. Run analyzer tool(s) that consume NDJSON and map commands to API
   descriptors/OpenAPI operations.
3. Generate machine-readable JSON and human-readable markdown outputs.
4. Triage failures by category using analyzer outputs.

## Tooling Boundaries

- Avoid importing runtime discovery modules in standalone analyzers if they pull
  config from dist-relative paths.
- Keep analyzer dependencies explicit and minimal.
- Record provenance in outputs (input log, openapi path, generation timestamp).

## Behavior Expectations

- Respect explicit operator boundaries immediately and exactly.
- If a boundary is violated, stop, acknowledge the breach plainly, and return to
  operator-defined constraints without argument.
- Ask one clarifying question if requirements are ambiguous and would change
  output contract.
- Prefer small, reversible diffs that preserve existing architecture
  constraints.
- When constraints conflict with quick fixes, prioritize architecture
  constraints.
