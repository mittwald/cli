`mw update`
===========

update the mw CLI

* [`mw update [CHANNEL]`](#mw-update-channel)

## `mw update [CHANNEL]`

update the mw CLI

```
USAGE
  $ mw update [CHANNEL] [--force |  | [-a | -v <value> | -i]]

FLAGS
  -a, --available        See available versions.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
      --force            Force a re-download of the requested version.

DESCRIPTION
  update the mw CLI

EXAMPLES
  Update to the stable channel:

    $ mw update stable

  Update to a specific version:

    $ mw update --version 1.0.0

  Interactively select version:

    $ mw update --interactive

  See available versions:

    $ mw update --available
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v4.5.5/src/commands/update.ts)_
