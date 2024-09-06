`mw context`
============

Save certain environment parameters for later use

* [`mw context get`](#mw-context-get)
* [`mw context reset`](#mw-context-reset)
* [`mw context set`](#mw-context-set)

## `mw context get`

Print an overview of currently set context parameters

```
USAGE
  $ mw context get [-o txt|json]

FLAGS
  -o, --output=<option>  [default: txt] The output format to use; use 'txt' for a human readable text representation,
                         and 'json' for a machine-readable JSON representation.
                         <options: txt|json>

DESCRIPTION
  Print an overview of currently set context parameters

  The context allows you to persistently set values for common parameters, like --project-id or --server-id, so you
  don't have to specify them on every command.
```

## `mw context reset`

Reset context values

```
USAGE
  $ mw context reset

DESCRIPTION
  Reset context values

  This command resets any values for common parameters that you've previously set with 'context set'.
```

## `mw context set`

Set context values for the current project, org or server

```
USAGE
  $ mw context set [--project-id <value>] [--server-id <value>] [--org-id <value>] [--installation-id <value>]

FLAGS
  --installation-id=<value>  ID or short ID of an app installation
  --org-id=<value>           ID or short ID of an organization
  --project-id=<value>       ID or short ID of a project
  --server-id=<value>        ID or short ID of a server

DESCRIPTION
  Set context values for the current project, org or server

  The context allows you to persistently set values for common parameters, like --project-id or --server-id, so you
  don't have to specify them on every command.
```
