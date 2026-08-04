---
name: repo-command-authoring
description: Use when creating or modifying CLI commands in this repository. Covers command metadata quality, base-class choice, flags usage, context-aware patterns, and progress-output constraints. Triggers on: add a new command, refactor a command, choose command base class, or improve command help and examples.
---

# Repo Command Authoring Playbook

Use this skill for day-to-day command implementation choices.

## Authoring Rules

- Keep command summary short.
- Do not repeat the summary at the start of description text.
- Provide `static examples` when useful for operator clarity.
- Prefer specialized flags from `src/lib/resources/*/flags.ts`.

## Base Class Selection Guide

- Use `ListBaseCommand` for list-shaped resources.
- Use `RenderBaseCommand` for single-resource output.
- Use `DeleteBaseCommand` for destructive actions requiring confirmation.
- Use `ExecRenderBaseCommand` only when exec-then-render semantics fit.

## Critical Constraint for `ExecRenderBaseCommand`

`ExecRenderBaseCommand` does not provide real-time progress output by itself. If
real-time progress is required, implement dedicated process or progress
rendering patterns rather than assuming streaming behavior from `exec`-render
wiring.

## Context-Aware Command Pattern

1. Determine whether project or organization scope is required.
2. Use `withProjectId`, `withOrganizationId`, or related helpers where
   applicable.
3. Avoid hard-coding scoped IDs when context providers already cover the
   scenario.

## Implementation Checklist

1. Place command in the correct domain folder under `src/commands`.
2. Choose base class by output and lifecycle shape.
3. Wire flags through shared resource flag utilities.
4. Add or refine static examples.
5. Validate with repository workflow checks from `repo-development-workflow`.

## Boundaries

This skill focuses on command implementation quality. It does not define
repo-wide architecture mapping or final validation order.
