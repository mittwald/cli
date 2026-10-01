---
name: repo-cli-architecture
description: Use for understanding and navigating this oclif-based CLI architecture, including command layout, base command hierarchy, context providers, rendering layers, and API integration patterns. Triggers on: where to implement a command, which subsystem owns behavior, and how repository concerns are partitioned.
---

# Repo CLI Architecture

This repository is an `oclif` CLI for the `mStudio v2 API`. Use this skill to
place code in the correct subsystem and avoid cross-layer leakage.

## Architectural Map

- Command entrypoints: `src/commands` by domain (`app`, `backup`, `container`,
  and others)
- Base command classes: `src/lib/basecommands`
- Context subsystem: `src/lib/context`
- Rendering subsystem: `src/rendering`
- API communication: `@mittwald/api-client` wiring in command flows

## Base Command Hierarchy

- `BaseCommand`: authenticated command foundation with API client setup
- `ListBaseCommand`: list operations with table output patterns
- `RenderBaseCommand`: render single-resource responses
- `ExecRenderBaseCommand`: run `exec` first, then render with Ink
- `DeleteBaseCommand`: delete flows with confirmation semantics

## Context Providers

Context persistence can be resolved from multiple sources:

- `UserContextProvider`
- `TerraformContextProvider`
- `DDEVContextProvider`

Use context helpers such as `withProjectId` and `withOrganizationId` in
context-aware commands.

## Rendering Layers

Rendering responsibilities include:

- Table formatting with `CSV` and `JSON` output support
- React-based output components
- Process visualization for long-running operations

## API Integration Expectations

- Use `@mittwald/api-client` for API access
- Preserve retry and consistency behavior from existing patterns
- Keep auth token sourcing consistent with existing command pathways

## Placement Playbook

1. Identify resource domain and locate matching folder in `src/commands`.
2. Select the smallest fitting base command class.
3. Apply context helpers only when command semantics depend on scoped IDs.
4. Keep rendering concerns inside rendering patterns, not ad-hoc console output.

## Boundaries

This skill does not define validation command order or release hygiene. Use
`repo-development-workflow` for that.
