`mw container`
==============

List containers belonging to a project.

* [`mw container list`](#mw-container-list)
* [`mw container logs CONTAINER-ID`](#mw-container-logs-container-id)
* [`mw container ls`](#mw-container-ls)

## `mw container list`

List containers belonging to a project.

```
USAGE
  $ mw container list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
    [--csv-separator ,|;] [-p <value>]

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

DESCRIPTION
  List containers belonging to a project.

ALIASES
  $ mw container ls

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw container logs CONTAINER-ID`

Display logs of a specific container.

```
USAGE
  $ mw container logs CONTAINER-ID -o txt|json|yaml [-p <value>] [--no-pager]

ARGUMENTS
  CONTAINER-ID  ID of the container for which to get logs

FLAGS
  -o, --output=<option>     (required) [default: txt] output in a more machine friendly format
                            <options: txt|json|yaml>
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
      --no-pager            Disable pager for output.

DESCRIPTION
  Display logs of a specific container.

  This command prints the log output of a specific container. When this command is run in a terminal, the output is
  piped through a pager. The pager is determined by your PAGER environment variable, with defaulting to "less". You can
  disable this behavior with the --no-pager flag.

ALIASES
  $ mw container ls

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw container ls`

List containers belonging to a project.

```
USAGE
  $ mw container ls -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
    [--csv-separator ,|;] [-p <value>]

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

DESCRIPTION
  List containers belonging to a project.

ALIASES
  $ mw container ls

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```
