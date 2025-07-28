`mw registry`
=============

Manage container registries

* [`mw registry create`](#mw-registry-create)
* [`mw registry delete REGISTRY-ID`](#mw-registry-delete-registry-id)
* [`mw registry list`](#mw-registry-list)
* [`mw registry update REGISTRY-ID`](#mw-registry-update-registry-id)

## `mw registry create`

Create a new container registry

```
USAGE
  $ mw registry create --uri <value> --description <value> [--token <value>] [-p <value>] [-q] [--username <value>]
    [--password <value>]

FLAGS
  -p, --project-id=<value>   ID or short ID of a project; this flag is optional if a default project is set in the
                             context
  -q, --quiet                suppress process output and only display a machine-readable summary
      --description=<value>  (required) description of the registry
      --password=<value>     password for registry authentication
      --token=<value>        API token to use for authentication (overrides environment and config file)
      --uri=<value>          (required) uri of the registry
      --username=<value>     username for registry authentication

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --password=<value>  password for registry authentication

    If omitted but username is provided, the command will prompt interactively for a password.

    CAUTION: providing this flag may log your password in your shell history!
```

## `mw registry delete REGISTRY-ID`

Delete a container registry

```
USAGE
  $ mw registry delete REGISTRY-ID [--token <value>] [-q] [-f]

FLAGS
  -f, --force          do not ask for confirmation
  -q, --quiet          suppress process output and only display a machine-readable summary
      --token=<value>  API token to use for authentication (overrides environment and config file)

DESCRIPTION
  Delete a container registry

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw registry list`

List container registries.

```
USAGE
  $ mw registry list -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
    [--no-relative-dates] [--csv-separator ,|;] [-p <value>]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -p, --project-id=<value>      ID or short ID of a project; this flag is optional if a default project is set in the
                                context
  -x, --extended                show extended information
      --csv-separator=<option>  [default: ,] separator for CSV output (only relevant for CSV output)
                                <options: ,|;>
      --no-header               hide table header
      --no-relative-dates       show dates in absolute format, not relative (only relevant for txt output)
      --no-truncate             do not truncate output (only relevant for txt output)
      --token=<value>           API token to use for authentication (overrides environment and config file)

DESCRIPTION
  List container registries.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw registry update REGISTRY-ID`

Update an existing container registry

```
USAGE
  $ mw registry update REGISTRY-ID [--token <value>] [-q] [--description <value>] [--uri <value>] [--username
    <value>] [--password <value>]

FLAGS
  -q, --quiet                suppress process output and only display a machine-readable summary
      --description=<value>  new description for the registry
      --password=<value>     password for registry authentication
      --token=<value>        API token to use for authentication (overrides environment and config file)
      --uri=<value>          new uri for the registry
      --username=<value>     username for registry authentication

DESCRIPTION
  Update an existing container registry

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --password=<value>  password for registry authentication

    If omitted but username is provided, the command will prompt interactively for a password.

    CAUTION: providing this flag may log your password in your shell history!
```
