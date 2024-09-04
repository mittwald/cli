`mw server`
===========

Manage your servers

* [`mw server get [SERVER-ID]`](#mw-server-get-server-id)
* [`mw server list`](#mw-server-list)

## `mw server get [SERVER-ID]`

Get a server.

```
USAGE
  $ mw server get [SERVER-ID] [-o json|yaml |  | ]

ARGUMENTS
  SERVER-ID  ID or short ID of a server; this argument is optional if a default server is set in the context.

FLAGS
  -o, --output=<option>  output in a more machine friendly format
                         <options: json|yaml>

DESCRIPTION
  Get a server.
```

## `mw server list`

List servers for an organization or user.

```
USAGE
  $ mw server list [--columns <value> | -x] [--no-header | [--csv | --no-truncate]] [-o txt|json|yaml|csv |  | ]
    [--no-relative-dates]

FLAGS
  -o, --output=<option>    [default: txt] output in a more machine friendly format
                           <options: txt|json|yaml|csv>
  -x, --extended           show extra columns
      --columns=<value>    only show provided columns (comma-separated)
      --csv                output is csv format [alias: --output=csv]
      --no-header          hide table header from output
      --no-relative-dates  show dates in absolute format, not relative
      --no-truncate        do not truncate output to fit screen

DESCRIPTION
  List servers for an organization or user.
```
