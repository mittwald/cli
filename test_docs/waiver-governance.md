# Waiver Governance for Integration Command Matrix (Draft)

## Purpose
Waivers are a governance tool, not a suppression shortcut. They document known failing commands with category, reason, and follow-up intent while keeping failures auditable.

## Source of Truth
- Waivers file: src/test/integration/config/command-waivers.json
- Waiver loader validation: src/test/integration/config/loader.ts
- Enforcement during run: src/test/integration/run-all-commands.test.ts

## Waiver Schema
Each waiver entry must include:
- id
- commandId
- category
- reason

Optional:
- issue
- expiresOn

Allowed categories:
- ARG_MISUSE
- INTERACTIVE_REQUIRED
- RESOURCE_PRECONDITION
- CONTRACT_SHAPE
- COMMAND_BUG
- DEPRECATED_ENDPOINT

## Hard Invariants
Always (loader validation):
1. Duplicate waiver IDs are invalid.
2. Duplicate waiver commandId entries are invalid.

In full-matrix mode (no category filter and no command override):
3. Waiver commandId must map to a currently discovered command.
4. Commands classified INTERACTIVE_REQUIRED without waivers fail as governance drift.

## Relaxed Invariants by Design
In targeted modes, the global waiver consistency check is skipped:
- category-filter mode
- single-command override mode (MW_TEST_COMMAND_ID)

Reason:
- these modes are intentionally partial and used for investigation loops.

Important:
- loader-level duplicate checks still apply in all modes.

## Waiver Hunting Workflow
1. Run one command with MW_TEST_COMMAND_ID.
2. Reproduce and inspect failure details.
3. Decide one branch:
   - fix command
   - fix test fixture/precondition
   - keep/add waiver with explicit reason and issue link
4. Re-run same command until category and behavior are stable.
5. If command becomes callable, remove waiver.

## When to Add a Waiver
Add a waiver only when all are true:
1. Failure is understood and reproducible.
2. Category assignment is stable.
3. A near-term fix cannot be delivered in current change scope.

## When Not to Add a Waiver
Do not add waivers for:
- unknown failures
- flaky behavior without root cause
- argument synthesis defects that should be fixed in invocation profiles

## Quality Bar for Waiver Reasons
A good reason includes:
- failure mechanism
- where it fails (component/path)
- what condition is missing
- intended fix direction

A weak reason includes only:
- "fails in CI"
- "does not work"

## Review Checklist
1. Is commandId exact and currently discoverable?
2. Is category accurate against latest failure output?
3. Is reason concrete and technical?
4. Is issue/follow-up marker present for remediation?
5. Should this waiver be removed because behavior is now fixed?
