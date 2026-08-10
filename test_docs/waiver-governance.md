# Waiver Governance for Integration Command Matrix (Draft)

## Purpose
Waivers are a governance tool, not a suppression shortcut. They document known failing commands with category, reason, and follow-up intent while keeping failures auditable.

## Core Principle: Unwaived Commands Must Not Fail

**All discovered commands must either pass or have an explicit waiver.** This is a hard invariant enforced by:
- **CI gate**: Integration test fails if any command is unwaived and fails
- **Peer review**: Waiver reasons must be understood and justified by reviewers

This principle prevents silent rot and forces intentional decision-making: if a command fails and you can't fix it in the current scope, you *must* write a waiver in the same PR with a concrete reason. The friction is intentional.

## Lazy Enforcement Philosophy

Waivers work best when enforcement is simple and visible:

- **No speculative waivers** — Waivers can only be added when a command fails. Pre-emptive waivers hide problems that should be surfaced now.

- **Reasons are contemporary** — The waiver reason appears in the PR diff next to the code change. Reviewers see intent immediately. This scales better than historical archaeology through git blame.

- **Emergent categorization** — Don't invent category hierarchy upfront. Patterns emerge naturally as waivers accumulate. After 20-30 waivers, category trends become visible and inform the next governance decision.

- **Human review is the gate** — Reviewers must understand why each waiver exists. A weak reason ("known issue", "API doesn't work") gets pushed back. A concrete reason ("API response schema missing `examples` field, blocking invocation synthesis; filed as API-1234") survives review. This quality pressure is self-reinforcing.

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

## Operational Enforcement: CI Gate + Peer Review
This governance model requires both:

**CI Gate (Mechanical):**
- Integration test suite runs all discovered commands
- Test fails if any command is unwaived and fails
- Test fails if waiver references a non-existent command
- Test fails if duplicate waivers exist

**Peer Review (Human):**
- Reviewers must understand waiver semantics
- Waiver PRs are not auto-approved based on metrics
- Weak reasons trigger discussion, not merges
- Category assignment is debated if unclear

Together, these prevent silent drift. You can't sneak in a waiver without explaining it; you can't add unmaintainable waivers because reviewers catch them.

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
- failure mechanism (what broke and why)
- where it fails (component/path/layer)
- what condition is missing (fixture, API contract, design decision)
- intended fix direction (or why it's a permanent trade-off)

A weak reason includes only:
- "fails in CI"
- "does not work"
- "known issue"
- "API thing"

Weak reasons get rejected in review. The author must explain themselves to the reviewer. This quality pressure is a feature, not friction.

## Review Checklist: Reviewer Responsibility
Reviewers must actively evaluate *every* waiver addition. Your job is to:

1. **Understand the failure** — Did the author explain what broke? Can you reproduce it from the reason alone?
2. **Validate category** — Is the waiver category accurate? Does it match the actual failure root cause?
3. **Evaluate reason quality** — Is the reason concrete and specific? Would a future reader (or you in 6 months) understand this waiver?
4. **Require issue tracking** — For anything that's not a permanent design decision, is there an issue link? Does it have a target fix date?
5. **Question necessity** — Could this waiver have been avoided by fixing the command, fixture, or invocation profile in the same PR?
6. **Check for rot** — Are there existing waivers that should be removed because behavior is now fixed?

Reject vague waivers. The 5 minutes you spend pushing back on reason quality prevents 10 hours of future confusion when someone tries to understand why the waiver exists.
