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
  $ mw context get [--token <value>] [-o txt|json]

FLAGS
  -o, --output=<option>  [default: txt] The output format to use; use 'txt' for a human readable text representation,
                         and 'json' for a machine-readable JSON representation.
                         <options: txt|json>

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Print an overview of currently set context parameters

  The context allows you to persistently set values for common parameters, like --project-id or --server-id, so you
  don't have to specify them on every command.
```


## `mw context reset`

Reset context values

```
USAGE
  $ mw context reset [--token <value>]

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Reset context values

  This command resets any values for common parameters that you've previously set with 'context set'.
```


## `mw context set`

Set context values for the current project, org or server

```
USAGE
  $ mw context set [--token <value>] [--project-id <value>] [--server-id <value>] [--org-id <value>]
    [--installation-id <value>] [--stack-id <value>]

FLAGS
  --installation-id=<value>  ID or short ID of an app installation
  --org-id=<value>           ID or short ID of an organization
  --project-id=<value>       ID or short ID of a project
  --server-id=<value>        ID or short ID of a server
  --stack-id=<value>         ID of a container stack

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Set context values for the current project, org or server

  The context allows you to persistently set values for common parameters, like --project-id or --server-id, so you
  don't have to specify them on every command.
```

