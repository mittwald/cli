`mw server`
===========

Manage your servers

* [`mw server get [SERVER-ID]`](#mw-server-get-server-id)
* [`mw server list`](#mw-server-list)

## `mw server get [SERVER-ID]`

Get a server.

```
USAGE
  $ mw server get [SERVER-ID] -o txt|json|yaml [--token <value>]

ARGUMENTS
  [SERVER-ID]  ID or short ID of a server; this argument is optional if a default server is set in the context.

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Get a server.
```

_See code: [src/commands/server/get.ts](https://github.com/mittwald/cli/blob/v0.0.0-development/src/commands/server/get.ts)_

## `mw server list`

List servers for an organization or user.

```
USAGE
  $ mw server list -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
    [--no-relative-dates] [--csv-separator ,|;]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -x, --extended                show extended information
      --csv-separator=<option>  [default: ,] separator for CSV output (only relevant for CSV output)
                                <options: ,|;>
      --no-header               hide table header
      --no-relative-dates       show dates in absolute format, not relative (only relevant for txt output)
      --no-truncate             do not truncate output (only relevant for txt output)

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  List servers for an organization or user.
```

_See code: [src/commands/server/list.ts](https://github.com/mittwald/cli/blob/v0.0.0-development/src/commands/server/list.ts)_
