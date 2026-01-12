# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Development Commands

**Build & Test:**

- `yarn compile` - Compile TypeScript to JavaScript
- `yarn test` - Run all tests (format, licenses, unit)
- `yarn test:unit` - Run unit tests only with Jest
- `yarn lint` - Run ESLint on the codebase
- `yarn format` - Format code with Prettier

**Development:**

- `yarn clean` - Clean compiled files and build artifacts
- `yarn generate:readme > &/dev/null` - Generate documentation from command
  definitions

## Development best practices

- Follow the conventional commit format when writing commit messages
- Make sure to re-generate the documentation before each commit

## Architecture Overview

This is a CLI tool built with [oclif](https://oclif.io/) for interacting with
the mittwald mStudio v2 API. The CLI is structured as follows:

### Core Structure

**Commands:** Located in `src/commands/` organized by domain (app, backup,
container, etc.). Each command corresponds to a specific API operation.

**Base Command Classes:** The CLI uses a hierarchy of base classes in
`src/lib/basecommands/`:

- `BaseCommand` - Authenticated commands with API client setup
- `ListBaseCommand` - List operations with table formatting
- `RenderBaseCommand` - Single resource display
- `ExecRenderBaseCommand` - Long-running operations with progress
- `DeleteBaseCommand` - Delete operations with confirmation

**Context System:** Context management in `src/lib/context/` allows commands to
remember resource IDs (project, org, server) across invocations using multiple
providers:

- `UserContextProvider` - User configuration files
- `TerraformContextProvider` - Terraform state files
- `DDEVContextProvider` - DDEV configuration

**Rendering System:** UI components in `src/rendering/` provide:

- Table formatting with CSV/JSON output support
- React-based components for command output
- Process visualization for long-running operations

### Key Patterns

**Command Implementation:**

- Inherit from appropriate base class (`ListBaseCommand`, `RenderBaseCommand`,
  etc.)
- Use specialized flags from `src/lib/resources/*/flags.ts`
- Implement context-aware commands with `withProjectId`, `withOrganizationId`,
  etc.

**Resource Management:**

- Commands are organized by resource type (app, database, domain, etc.)
- Each resource has associated flags, hooks, and utility functions
- Resources support short IDs where available for user convenience

**API Integration:**

- Uses `@mittwald/api-client` for API communication
- Automatic retry logic and consistency handling
- Authentication via API tokens (file, environment, or flag)

## Coding hints

### When writing commands

- Provide examples using the `static examples` property when useful
- Keep the command summary short; do not repeat the summary at the beginning of
  the description
