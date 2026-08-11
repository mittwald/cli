---
name: oclif-flag-style
description:
  Preserve idiomatic oclif flag definitions in this CLI. Trigger when creating,
  refactoring, or reviewing flags, especially in shared resource flag modules
  and command static flags blocks.
---

# Oclif Flag Style

Use this style for all CLI flags unless there is a strong, explicit reason not
to.

## Canonical pattern

1. Define shared reusable flags as exported constants in shared modules.
2. Invoke those constants at command usage sites to provide command-specific
   metadata (for example summary or description).
3. Keep shared defaults in one place (required, multiple, non-greedy, chars that
   are truly global).
4. Keep command wording local to the command (summary text and context wording).

Example:

```ts
// Shared export
export const containerDescriptionFlag = Flags.custom<string>({
  description: "This helps identify the container's purpose or contents.",
  required: false,
});

// Command usage
static flags = {
  description: containerDescriptionFlag({
    summary: "add a descriptive label to the container",
  }),
};
```

## When not to invoke

If the export is already a final flag object with no per-command overrides,
assign it directly.

```ts
// Shared export
export const containerPublishAllFlag = Flags.boolean({
  summary: "publish all ports that are defined in the image",
  required: false,
  char: "P",
});

// Command usage
static flags = {
  "publish-all": containerPublishAllFlag,
};
```

## Anti-patterns to avoid

- Wrapper helpers that only forward options into Flags.custom and immediately
  invoke, for example makeXFlagOptions(...).
- Duplicating the same shared parse/multiple/required behavior across commands.
- Moving command-specific summary text into shared modules.

## Migration rule

When touching legacy flag code:

1. Replace makeXFlagOptions helpers with exported base flag constants.
2. Keep behavior identical.
3. Move summary wording into each command usage.
4. Keep diffs minimal and avoid unrelated refactors.

## Review checklist

- Shared module exports are named constants (for example xFlag).
- Command flag blocks use xFlag({...}) when metadata differs per command.
- Direct assignment is used for final non-invoked flags.
- No new makeXFlagOptions wrappers are introduced.
- Existing user-facing help text remains clear and command-specific.
