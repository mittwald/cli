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
* [`mw cronjob update CRONJOB-ID`](#mw-cronjob-update-cronjob-id)

## `mw cronjob create`

Create a new cron job

```
USAGE
  $ mw cronjob create --description <value> --interval <value> [-i <value>] [-q] [--email <value>] [--url <value>]
    [--command <value> --interpreter bash|php] [--disable] [--timeout <value>]

FLAGS
  -i, --installation-id=<value>  ID or short ID of an app installation; this flag is optional if a default app
                                 installation is set in the context
  -q, --quiet                    suppress process output and only display a machine-readable summary.
      --command=<value>          Specify the file and arguments to be executed when the cron job is run.
      --description=<value>      (required) Set cron job description.
      --disable                  Disable the cron job.
      --email=<value>            Set the target email to which error messages will be sent.
      --interpreter=<option>     Set the interpreter to be used for execution.
                                 <options: bash|php>
      --interval=<value>         (required) Set the interval for cron jobs to run.
      --timeout=<value>          [default: 3600s] Timeout after which the process will be killed.
      --url=<value>              Set the URL to use when running a cron job.

FLAG DESCRIPTIONS
  -i, --installation-id=<value>

    ID or short ID of an app installation; this flag is optional if a default app installation is set in the context

    May contain a short ID or a full ID of an app installation; you can also use the "mw context set
    --installation-id=<VALUE>" command to persistently set a default app installation for all commands that accept this
    flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --command=<value>  Specify the file and arguments to be executed when the cron job is run.

    Specifies a file to be executed with the specified interpreter. Additional arguments can be appended to the command
    to be passed to the script. Not required if a URL is given.

  --description=<value>  Set cron job description.

    This will be displayed as the cron jobs 'name' of the cron job in mStudio.

  --disable  Disable the cron job.

    When creating a cron job it is enabled by default. This flag can be used to set the status of the cron job to
    inactive when creating one. Automatic execution will then be disabled until enabled manually.

  --email=<value>  Set the target email to which error messages will be sent.

    If a cron job fails, a detailed error message will be sent to this email address.

  --interpreter=bash|php  Set the interpreter to be used for execution.

    Must be either 'bash' or 'php'. Define the interpreter to be used to execute the previously defined command. The
    interpreter should match the corresponding command or script.

  --interval=<value>  Set the interval for cron jobs to run.

    Must be specified as a cron schedule expression. Defines the interval at which the cron job will be executed.

  --timeout=<value>  Timeout after which the process will be killed.

    Common duration formats are supported (for example, '1h', '30m', '30s'). Defines the amount of time after which a
    running cron job will be killed. If an email address is defined, an error message will be sent.

  --url=<value>  Set the URL to use when running a cron job.

    Define a URL with protocol to which a request will be dispatched when the cron job is executed. For example:
    'https://my-website.com/cron-job'. Not required if a command and interpreter is defined.
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
  $ mw cronjob execution get CRONJOB-ID EXECUTION-ID -o txt|json|yaml

ARGUMENTS
  CRONJOB-ID    ID of the cronjob the execution belongs to
  EXECUTION-ID  ID of the cronjob execution to be retrieved.

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get a cron job execution.

ALIASES
  $ mw project cronjob execution get
```

## `mw cronjob execution list`

List CronjobExecutions belonging to a Cronjob.

```
USAGE
  $ mw cronjob execution list -o txt|json|yaml|csv|tsv --cronjob-id <value> [-x] [--no-header] [--no-truncate]
    [--no-relative-dates] [--csv-separator ,|;]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -x, --extended                show extended information
      --cronjob-id=<value>      (required) ID of the cron job for which to list executions for.
      --csv-separator=<option>  [default: ,] separator for CSV output (only relevant for CSV output)
                                <options: ,|;>
      --no-header               hide table header
      --no-relative-dates       show dates in absolute format, not relative (only relevant for txt output)
      --no-truncate             do not truncate output (only relevant for txt output)

DESCRIPTION
  List CronjobExecutions belonging to a Cronjob.

ALIASES
  $ mw project cronjob execution list
```

## `mw cronjob execution logs CRONJOB-ID EXECUTION-ID`

Get the log output of a cronjob execution.

```
USAGE
  $ mw cronjob execution logs CRONJOB-ID EXECUTION-ID -o txt|json|yaml [--no-pager]

ARGUMENTS
  CRONJOB-ID    ID of the cronjob the execution belongs to
  EXECUTION-ID  ID of the cronjob execution to be retrieved.

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>
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
  $ mw cronjob get CRONJOB-ID -o txt|json|yaml

ARGUMENTS
  CRONJOB-ID  ID of the cron job to be retrieved.

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get details of a cron job
```

## `mw cronjob list`

List cron jobs belonging to a project.

```
USAGE
  $ mw cronjob list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List cron jobs belonging to a project.

ALIASES
  $ mw project cronjob list

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw cronjob update CRONJOB-ID`

Update an existing cron job

```
USAGE
  $ mw cronjob update CRONJOB-ID [-q] [--description <value>] [--interval <value>] [--email <value>] [--url <value>
    | --command <value>] [--interpreter bash|php ] [--enable | --disable] [--timeout <value>]

ARGUMENTS
  CRONJOB-ID  ID of the cron job to be updated.

FLAGS
  -q, --quiet                 suppress process output and only display a machine-readable summary.
      --command=<value>       Specify the file and arguments to be executed when the cron job is run.
      --description=<value>   Set cron job description.
      --disable               Disable the cron job.
      --email=<value>         Set the target email to which error messages will be sent.
      --enable                Enable the cron job.
      --interpreter=<option>  Set the interpreter to be used for execution.
                              <options: bash|php>
      --interval=<value>      Set the interval for cron jobs to run.
      --timeout=<value>       Timeout after which the process will be killed.
      --url=<value>           Set the URL to use when running a cron job.

DESCRIPTION
  Update an existing cron job

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --command=<value>  Specify the file and arguments to be executed when the cron job is run.

    Specifies a file to be executed with the specified interpreter. Additional arguments can be appended to the command
    to be passed to the script. Not required if a URL is given.

  --description=<value>  Set cron job description.

    This will be displayed as the cron jobs 'name' of the cron job in mStudio.

  --disable  Disable the cron job.

    Set the status of the cron job to active. Automatic execution will be enabled.

  --email=<value>  Set the target email to which error messages will be sent.

    If a cron job fails, a detailed error message will be sent to this email address.

  --enable  Enable the cron job.

    Set the status of the cron job to inactive. Automatic execution will be disabled.

  --interpreter=bash|php  Set the interpreter to be used for execution.

    Must be either 'bash' or 'php'. Define the interpreter to be used to execute the previously defined command. The
    interpreter should match the corresponding command or script.

  --interval=<value>  Set the interval for cron jobs to run.

    Must be specified as a cron schedule expression. Defines the interval at which the cron job will be executed.

  --timeout=<value>  Timeout after which the process will be killed.

    Common duration formats are supported (for example, '1h', '30m', '30s'). Defines the amount of time after which a
    running cron job will be killed. If an email address is defined, an error message will be sent.

  --url=<value>  Set the URL to use when running a cron job.

    Define a URL with protocol to which a request will be dispatched when the cron job is executed. For example:
    'https://my-website.com/cron-job'. Not required if a command and interpreter is defined.
```
