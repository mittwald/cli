`mw cronjob`
============

Manage cronjobs of your projects

* [`mw cronjob create`](#mw-cronjob-create)
* [`mw cronjob delete CRONJOB-ID`](#mw-cronjob-delete-cronjob-id)
* [`mw cronjob execute CRONJOB-ID`](#mw-cronjob-execute-cronjob-id)
* [`mw cronjob execution abort CRONJOB-ID EXECUTION-ID`](#mw-cronjob-execution-abort-cronjob-id-execution-id)
* [`mw cronjob execution get CRONJOB-ID EXECUTION-ID`](#mw-cronjob-execution-get-cronjob-id-execution-id)
* [`mw cronjob execution list`](#mw-cronjob-execution-list)
* [`mw cronjob execution logs CRONJOB-ID EXECUTION-ID`](#mw-cronjob-execution-logs-cronjob-id-execution-id)
* [`mw cronjob get CRONJOB-ID`](#mw-cronjob-get-cronjob-id)
* [`mw cronjob list`](#mw-cronjob-list)

## `mw cronjob create`

Create a new cron job

```
USAGE
  $ mw cronjob create --description <value> --interval <value> [-i <value>] [-q] [--disable] [--email <value>]
    [--url <value> | --command <value>] [--interpreter <value>] [--timeout <value>]

FLAGS
  -i, --installation-id=<value>  ID or short ID of an app installation; this flag is optional if a default app
                                 installation is set in the context
  -q, --quiet                    suppress process output and only display a machine-readable summary.
      --command=<value>          Command to execute for the cron job; either this or `--url` is required.
      --description=<value>      (required) Description of the cron job
      --disable                  Disable the cron job after creation
      --email=<value>            Email address to send cron job output to
      --interpreter=<value>      [default: /bin/sh] Interpreter to use for the cron job
      --interval=<value>         (required) Interval of the cron job, in standard UNIX cron syntax
      --timeout=<value>          [default: 3600s] timeout for the cron job; common duration formats are supported (for
                                 example, '1h', '30m', '30s')
      --url=<value>              URL to call for the cron job; either this or `--command` is required.

FLAG DESCRIPTIONS
  -i, --installation-id=<value>

    ID or short ID of an app installation; this flag is optional if a default app installation is set in the context

    May contain a short ID or a full ID of an app installation; you can also use the "mw context set
    --installation-id=<VALUE>" command to persistently set a default app installation for all commands that accept this
    flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw cronjob delete CRONJOB-ID`

Delete a cron job

```
USAGE
  $ mw cronjob delete CRONJOB-ID [-q] [-f]

ARGUMENTS
  CRONJOB-ID  ID of the cronjob to be deleted.

FLAGS
  -f, --force  Do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Delete a cron job

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw cronjob execute CRONJOB-ID`

Manually run a cron job

```
USAGE
  $ mw cronjob execute CRONJOB-ID [-q]

FLAGS
  -q, --quiet  suppress process output and only display a machine-readable summary.

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw cronjob execution abort CRONJOB-ID EXECUTION-ID`

Abort a running cron job execution.

```
USAGE
  $ mw cronjob execution abort CRONJOB-ID EXECUTION-ID [-q]

ARGUMENTS
  CRONJOB-ID    ID of the cronjob the execution belongs to
  EXECUTION-ID  ID of the cron job execution to abort

FLAGS
  -q, --quiet  suppress process output and only display a machine-readable summary.

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw cronjob execution get CRONJOB-ID EXECUTION-ID`

Get a cron job execution.

```
USAGE
  $ mw cronjob execution get CRONJOB-ID EXECUTION-ID [-o json|yaml |  | ]

ARGUMENTS
  CRONJOB-ID    ID of the cronjob the execution belongs to
  EXECUTION-ID  ID of the cronjob execution to be retrieved.

FLAGS
  -o, --output=<option>  output in a more machine friendly format
                         <options: json|yaml>

DESCRIPTION
  Get a cron job execution.

ALIASES
  $ mw project cronjob execution get
```

## `mw cronjob execution list`

List CronjobExecutions belonging to a Cronjob.

```
USAGE
  $ mw cronjob execution list --cronjob-id <value> [--columns <value> | -x] [--no-header | [--csv | --no-truncate]] [-o
    txt|json|yaml|csv |  | ] [--no-relative-dates]

FLAGS
  -o, --output=<option>     [default: txt] output in a more machine friendly format
                            <options: txt|json|yaml|csv>
  -x, --extended            show extra columns
      --columns=<value>     only show provided columns (comma-separated)
      --cronjob-id=<value>  (required) ID of the cron job for which to list executions for.
      --csv                 output is csv format [alias: --output=csv]
      --no-header           hide table header from output
      --no-relative-dates   show dates in absolute format, not relative
      --no-truncate         do not truncate output to fit screen

DESCRIPTION
  List CronjobExecutions belonging to a Cronjob.

ALIASES
  $ mw project cronjob execution list
```

## `mw cronjob execution logs CRONJOB-ID EXECUTION-ID`

Get the log output of a cronjob execution.

```
USAGE
  $ mw cronjob execution logs CRONJOB-ID EXECUTION-ID [-o json|yaml |  | ] [--no-pager]

ARGUMENTS
  CRONJOB-ID    ID of the cronjob the execution belongs to
  EXECUTION-ID  ID of the cronjob execution to be retrieved.

FLAGS
  -o, --output=<option>  output in a more machine friendly format
                         <options: json|yaml>
      --no-pager         Disable pager for output.

DESCRIPTION
  Get the log output of a cronjob execution.

  This command prints the log output of a cronjob execution. When this command is run in a terminal, the output is piped
  through a pager. The pager is determined by your PAGER environment variable, with defaulting to "less". You can
  disable this behavior with the --no-pager flag.

ALIASES
  $ mw project cronjob execution logs
```

## `mw cronjob get CRONJOB-ID`

Get details of a cron job

```
USAGE
  $ mw cronjob get CRONJOB-ID [-o json|yaml |  | ]

ARGUMENTS
  CRONJOB-ID  ID of the cron job to be retrieved.

FLAGS
  -o, --output=<option>  output in a more machine friendly format
                         <options: json|yaml>

DESCRIPTION
  Get details of a cron job
```

## `mw cronjob list`

List cron jobs belonging to a project.

```
USAGE
  $ mw cronjob list [--columns <value> | -x] [--no-header | [--csv | --no-truncate]] [-o txt|json|yaml|csv |  | ]
    [--no-relative-dates] [-p <value>]

FLAGS
  -o, --output=<option>     [default: txt] output in a more machine friendly format
                            <options: txt|json|yaml|csv>
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -x, --extended            show extra columns
      --columns=<value>     only show provided columns (comma-separated)
      --csv                 output is csv format [alias: --output=csv]
      --no-header           hide table header from output
      --no-relative-dates   show dates in absolute format, not relative
      --no-truncate         do not truncate output to fit screen

DESCRIPTION
  List cron jobs belonging to a project.

ALIASES
  $ mw project cronjob list

FLAG DESCRIPTIONS
  -p, --project-id=<value>

    ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```
