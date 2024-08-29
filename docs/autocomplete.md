`mw autocomplete`
=================

Display autocomplete installation instructions.

* [`mw autocomplete [SHELL]`](#mw-autocomplete-shell)

## `mw autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ mw autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ mw autocomplete

  $ mw autocomplete bash

  $ mw autocomplete zsh

  $ mw autocomplete powershell

  $ mw autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.2.2/src/commands/autocomplete/index.ts)_
