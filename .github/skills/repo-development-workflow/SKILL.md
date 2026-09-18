---
name: repo-development-workflow
description: Use for repository-local build, lint, test, and documentation generation workflow in this CLI project. Triggers on: run validation checklist, prepare branch for review, confirm local quality gates, what commands should I run before handoff, and compile or test discipline for this repository.
---

# Repo Development Workflow

Use this skill when work requires deterministic local validation and handoff
readiness.

## What This Skill Owns

- Canonical development commands for this repository
- Ordered validation checklist before handoff
- Documentation regeneration step expectations
- `conventional commits` reminder

## Core Commands

- Compile TypeScript: `yarn compile`
- Full tests: `yarn test`
- Unit tests only: `yarn test:unit`
- Lint: `yarn lint`
- Format: `yarn format`
- Clean artifacts: `yarn clean`
- Regenerate command docs: `yarn generate:readme >/dev/null 2>&1`

## Environment Hints

- Shell: `fish` is the default interactive shell.
- Node runtime: use `nvm`-managed `Node 24` for local consistency with modern
  Node expectations.
- Before running validation commands in a fresh shell, ensure Node 24 is active:

```fish
nvm use 24
node --version
```

## Handoff Validation Order

Run these in exact order before concluding implementation work:

1. `yarn lint`
2. `yarn compile`
3. `yarn test`
4. `yarn generate:readme >/dev/null 2>&1`

## Execution Playbook

1. Run only the narrowest relevant checks during iteration.
2. Before final handoff, run the full ordered checklist.
3. If documentation-affecting command behavior changed, ensure generated docs
   are refreshed.
4. Use `conventional commits` when a commit is requested.

## Boundaries

This skill does not define architecture, command class selection, or rendering
strategy. Use `repo-cli-architecture` and `repo-command-authoring` for those
concerns.
