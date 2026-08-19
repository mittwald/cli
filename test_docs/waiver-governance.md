# Waiver Governance for Integration Command Matrix

## Purpose
Waivers are an explicit governance record for known failing integration commands.
They are not a suppression shortcut.

Goal:

- keep matrix failures auditable
- keep failure ownership visible in PRs
- prevent silent drift of integration quality

## Source of Truth

- Waiver data: `src/test/integration/config/command-waivers.json`
- Validation: `src/test/integration/config/loader.ts`
- Runtime enforcement: `src/test/integration/run-all-commands.test.ts`

## Core Rule

All discovered commands must either:

1. pass, or
2. have an explicit waiver that is accepted by policy.

If a command fails without waiver coverage, the integration run fails.

## Waiver Schema

Required fields per entry:

- `id`
- `commandId`
- `category`
- `reason`

Optional fields:

- `issue`
- `expiresOn`

Allowed categories:

- `ARG_MISUSE`
- `INTERACTIVE_REQUIRED`
- `RESOURCE_PRECONDITION`
- `CONTRACT_SHAPE`
- `COMMAND_BUG`
- `DEPRECATED_ENDPOINT`

## Enforced Invariants

Always enforced (all run modes):

1. duplicate waiver `id` is invalid
2. duplicate waiver `commandId` is invalid

Enforced in full matrix mode only (no category filter, no command override):

1. waiver `commandId` must exist in current discovery output

Additional governance enforcement:

- if a command is classified `INTERACTIVE_REQUIRED` and has no waiver (and no
   bypass mode is active), this is a failure and governance violation.

## Intentional Relaxations

In partial investigation modes, strict global waiver integrity checks are
skipped by design:

- category mode (`MW_TEST_CATEGORY`)
- single-command mode (`MW_TEST_COMMAND_ID`)

Reason:

- these modes are for focused diagnosis, not full governance assertions.

Important:

- loader-level duplicate validation still applies in all modes.

## Decision Gate: Fix vs Waive

Add or keep a waiver only when all conditions are true:

1. failure is reproducible
2. failure category is stable
3. fix is out of current scope or blocked by external dependency
4. reason explains mechanism and next action clearly

Do not waive when:

- root cause is unknown
- behavior is flaky and not diagnosed
- failure is due to invocation synthesis gap that should be fixed in profiles

## Reason Quality Standard

A strong waiver reason states:

1. what fails
2. where it fails
3. why it fails
4. what will resolve it (or why it is accepted long-term)

Examples:

- weak: `known issue`
- strong: `command requires interactive select branch in oclif prompt path; integration runner is non-interactive, no profile-based non-interactive fallback exists yet; tracked in MWCLI-742`

## Operational Workflow

### Add a Waiver

1. reproduce command in single-command mode with `MW_TEST_COMMAND_ID`
2. capture observed failure category and evidence
3. if fix is not in scope, add waiver entry with concrete reason
4. rerun the same command to confirm expected waived behavior in full mode

### Remove a Waiver

1. reproduce command with waiver bypass mode (`MW_TEST_COMMAND_ID`)
2. verify command now passes with normal synthesized invocation
3. remove waiver entry
4. rerun full matrix or at least category campaign to confirm no regressions

### Reclassify a Waiver

1. reproduce command with waiver bypass
2. confirm current failure category
3. update category and reason together in one change
4. rerun category campaign for both old and new categories when practical

## Review Checklist

Reviewer must check every waiver change:

1. command failure is understandable from evidence and reason
2. selected category matches actual failure mechanism
3. reason quality meets the standard above
4. issue link exists for non-permanent waivers
5. waiver is necessary (not a fixable in-scope defect)
6. stale waivers are removed when behavior is now fixed

Reject vague waivers. Governance quality is a correctness requirement.

## CI and Team Policy

Mechanical gate (CI):

- rejects unwaived failures
- rejects invalid waiver schema
- rejects duplicate waiver IDs/command IDs
- in full mode, rejects stale waiver command references

Human gate (review):

- validates reason quality and category correctness
- validates whether a waiver is the right choice for this change

Both gates are required. CI enforces structure; review enforces intent.
