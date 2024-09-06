`mw project`
============

Manage your projects, and also any kinds of user memberships concerning these projects.

* [`mw project backup create`](#mw-project-backup-create)
* [`mw project backup delete BACKUP-ID`](#mw-project-backup-delete-backup-id)
* [`mw project backup download BACKUP-ID`](#mw-project-backup-download-backup-id)
* [`mw project backup get BACKUP-ID`](#mw-project-backup-get-backup-id)
* [`mw project backup list`](#mw-project-backup-list)
* [`mw project backupschedule list`](#mw-project-backupschedule-list)
* [`mw project create`](#mw-project-create)
* [`mw project cronjob execution get CRONJOB-ID EXECUTION-ID`](#mw-project-cronjob-execution-get-cronjob-id-execution-id)
* [`mw project cronjob execution list`](#mw-project-cronjob-execution-list)
* [`mw project cronjob execution logs CRONJOB-ID EXECUTION-ID`](#mw-project-cronjob-execution-logs-cronjob-id-execution-id)
* [`mw project cronjob list`](#mw-project-cronjob-list)
* [`mw project delete [PROJECT-ID]`](#mw-project-delete-project-id)
* [`mw project filesystem usage [PROJECT-ID]`](#mw-project-filesystem-usage-project-id)
* [`mw project get [PROJECT-ID]`](#mw-project-get-project-id)
* [`mw project invite get INVITE-ID`](#mw-project-invite-get-invite-id)
* [`mw project invite list`](#mw-project-invite-list)
* [`mw project invite list-own`](#mw-project-invite-list-own)
* [`mw project list`](#mw-project-list)
* [`mw project membership get MEMBERSHIP-ID`](#mw-project-membership-get-membership-id)
* [`mw project membership get-own`](#mw-project-membership-get-own)
* [`mw project membership list`](#mw-project-membership-list)
* [`mw project membership list-own`](#mw-project-membership-list-own)
* [`mw project sftp-user list`](#mw-project-sftp-user-list)
* [`mw project ssh [PROJECT-ID]`](#mw-project-ssh-project-id)
* [`mw project ssh-user list`](#mw-project-ssh-user-list)
* [`mw project update [PROJECT-ID]`](#mw-project-update-project-id)

## `mw project backup create`

Create a new backup of a project

```
USAGE
  $ mw project backup create --expires <value> [-q] [-p <value>] [--description <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>    ID or short ID of a project; this flag is optional if a default project is set in the
                              context
  -q, --quiet                 suppress process output and only display a machine-readable summary.
  -w, --wait                  wait for the resource to be ready.
      --description=<value>   a description for the backup.
      --expires=<value>       (required) an interval after which the backup expires (examples: 30m, 30d, 1y).
      --wait-timeout=<value>  [default: 600s] the duration to wait for the resource to be ready (common units like 'ms',
                              's', 'm' are accepted).

ALIASES
  $ mw project backup create

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw project backup delete BACKUP-ID`

Delete a backup

```
USAGE
  $ mw project backup delete BACKUP-ID [-q] [-f]

ARGUMENTS
  BACKUP-ID  ID or short ID of a backup.

FLAGS
  -f, --force  Do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Delete a backup

ALIASES
  $ mw project backup delete

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw project backup download BACKUP-ID`

Download a backup to your local disk

```
USAGE
  $ mw project backup download BACKUP-ID [-q] [--format tar|zip] [--password <value> | --generate-password |
    --prompt-password] [--resume --output <value>]

ARGUMENTS
  BACKUP-ID  ID or short ID of a backup.

FLAGS
  -q, --quiet              suppress process output and only display a machine-readable summary.
      --format=<option>    [default: tar] the file format to download the backup in.
                           <options: tar|zip>
      --generate-password  generate a random password to encrypt the backup with.
      --output=<value>     the file to write the backup to; if omitted, the filename will be determined by the server.
      --password=<value>   the password to encrypt the backup with.
      --prompt-password    prompt for a password to encrypt the backup with.
      --resume             resume a previously interrupted download.

DESCRIPTION
  Download a backup to your local disk

ALIASES
  $ mw project backup download

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --generate-password  generate a random password to encrypt the backup with.

    CAUTION: this is not stored anywhere.

  --password=<value>  the password to encrypt the backup with.

    CAUTION #1: this is not stored anywhere.
    CAUTION #2: it is dangerous to use this option, as the password might be stored in your shell history.

  --prompt-password  prompt for a password to encrypt the backup with.

    CAUTION: this is not stored anywhere.
```

## `mw project backup get BACKUP-ID`

Show details of a backup.

```
USAGE
  $ mw project backup get BACKUP-ID -o txt|json|yaml

ARGUMENTS
  BACKUP-ID  ID or short ID of a backup.

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Show details of a backup.

ALIASES
  $ mw project backup get
```

## `mw project backup list`

List Backups for a given Project.

```
USAGE
  $ mw project backup list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List Backups for a given Project.

ALIASES
  $ mw project backup list

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw project backupschedule list`

List backup schedules belonging to a given project.

```
USAGE
  $ mw project backupschedule list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List backup schedules belonging to a given project.

ALIASES
  $ mw project backupschedule list

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw project create`

Create a new project

```
USAGE
  $ mw project create -d <value> [-s <value>] [-q] [-w] [--wait-timeout <value>] [--update-context]

FLAGS
  -d, --description=<value>   (required) A description for the project.
  -q, --quiet                 suppress process output and only display a machine-readable summary.
  -s, --server-id=<value>     ID or short ID of a server; this flag is optional if a default server is set in the
                              context
  -w, --wait                  wait for the resource to be ready.
      --update-context        Update the CLI context to use the newly created project
      --wait-timeout=<value>  [default: 600s] the duration to wait for the resource to be ready (common units like 'ms',
                              's', 'm' are accepted).

DESCRIPTION
  Create a new project

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  -s, --server-id=<value>  ID or short ID of a server; this flag is optional if a default server is set in the context

    May contain a short ID or a full ID of a server; you can also use the "mw context set --server-id=<VALUE>" command
    to persistently set a default server for all commands that accept this flag.
```

## `mw project cronjob execution get CRONJOB-ID EXECUTION-ID`

Get a cron job execution.

```
USAGE
  $ mw project cronjob execution get CRONJOB-ID EXECUTION-ID -o txt|json|yaml

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

## `mw project cronjob execution list`

List CronjobExecutions belonging to a Cronjob.

```
USAGE
  $ mw project cronjob execution list -o txt|json|yaml|csv|tsv --cronjob-id <value> [-x] [--no-header] [--no-truncate]
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

## `mw project cronjob execution logs CRONJOB-ID EXECUTION-ID`

Get the log output of a cronjob execution.

```
USAGE
  $ mw project cronjob execution logs CRONJOB-ID EXECUTION-ID -o txt|json|yaml [--no-pager]

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

## `mw project cronjob list`

List cron jobs belonging to a project.

```
USAGE
  $ mw project cronjob list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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

## `mw project delete [PROJECT-ID]`

Delete a project

```
USAGE
  $ mw project delete [PROJECT-ID] [-q] [-f]

ARGUMENTS
  PROJECT-ID  ID or short ID of a project; this argument is optional if a default project is set in the context.

FLAGS
  -f, --force  Do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Delete a project

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw project filesystem usage [PROJECT-ID]`

Get a project directory filesystem usage.

```
USAGE
  $ mw project filesystem usage [PROJECT-ID] -o txt|json|yaml [--human]

ARGUMENTS
  PROJECT-ID  ID or short ID of a project; this argument is optional if a default project is set in the context.

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>
      --human            Display human readable sizes.

DESCRIPTION
  Get a project directory filesystem usage.
```

## `mw project get [PROJECT-ID]`

Get details of a project

```
USAGE
  $ mw project get [PROJECT-ID] -o txt|json|yaml

ARGUMENTS
  PROJECT-ID  ID or short ID of a project; this argument is optional if a default project is set in the context.

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get details of a project
```

## `mw project invite get INVITE-ID`

Get a ProjectInvite.

```
USAGE
  $ mw project invite get INVITE-ID -o txt|json|yaml

ARGUMENTS
  INVITE-ID  ID of the ProjectInvite to be retrieved.

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get a ProjectInvite.
```

## `mw project invite list`

List all invites belonging to a project.

```
USAGE
  $ mw project invite list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List all invites belonging to a project.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw project invite list-own`

List all project invites for the executing user.

```
USAGE
  $ mw project invite list-own -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
    [--csv-separator ,|;]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -x, --extended                show extended information
      --csv-separator=<option>  [default: ,] separator for CSV output (only relevant for CSV output)
                                <options: ,|;>
      --no-header               hide table header
      --no-relative-dates       show dates in absolute format, not relative (only relevant for txt output)
      --no-truncate             do not truncate output (only relevant for txt output)

DESCRIPTION
  List all project invites for the executing user.
```

## `mw project list`

List all projects that you have access to

```
USAGE
  $ mw project list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
    [--csv-separator ,|;]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -x, --extended                show extended information
      --csv-separator=<option>  [default: ,] separator for CSV output (only relevant for CSV output)
                                <options: ,|;>
      --no-header               hide table header
      --no-relative-dates       show dates in absolute format, not relative (only relevant for txt output)
      --no-truncate             do not truncate output (only relevant for txt output)

DESCRIPTION
  List all projects that you have access to
```

## `mw project membership get MEMBERSHIP-ID`

Get a ProjectMembership

```
USAGE
  $ mw project membership get MEMBERSHIP-ID -o txt|json|yaml

ARGUMENTS
  MEMBERSHIP-ID  ID of the ProjectMembership to be retrieved.

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get a ProjectMembership
```

## `mw project membership get-own`

Get the executing user's membership in a Project.

```
USAGE
  $ mw project membership get-own -o txt|json|yaml [-p <value>]

FLAGS
  -o, --output=<option>     (required) [default: txt] output in a more machine friendly format
                            <options: txt|json|yaml>
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context

DESCRIPTION
  Get the executing user's membership in a Project.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw project membership list`

List all memberships for a Project.

```
USAGE
  $ mw project membership list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List all memberships for a Project.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw project membership list-own`

List ProjectMemberships belonging to the executing user.

```
USAGE
  $ mw project membership list-own -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
    [--csv-separator ,|;]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -x, --extended                show extended information
      --csv-separator=<option>  [default: ,] separator for CSV output (only relevant for CSV output)
                                <options: ,|;>
      --no-header               hide table header
      --no-relative-dates       show dates in absolute format, not relative (only relevant for txt output)
      --no-truncate             do not truncate output (only relevant for txt output)

DESCRIPTION
  List ProjectMemberships belonging to the executing user.
```

## `mw project sftp-user list`

List all SFTP users for a project.

```
USAGE
  $ mw project sftp-user list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List all SFTP users for a project.

ALIASES
  $ mw project sftp-user list

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw project ssh [PROJECT-ID]`

Connect to a project via SSH

```
USAGE
  $ mw project ssh [PROJECT-ID] [--ssh-user <value>] [--ssh-identity-file <value>]

ARGUMENTS
  PROJECT-ID  ID or short ID of a project; this argument is optional if a default project is set in the context.

SSH CONNECTION FLAGS
  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.
  --ssh-user=<value>           override the SSH user to connect with; if omitted, your own user will be used

DESCRIPTION
  Connect to a project via SSH

  Establishes an interactive SSH connection to a project.

  This command is a wrapper around your systems SSH client, and will respect your SSH configuration in ~/.ssh/config.

  An exception to this is the 'User' configuration, which will be overridden by this command to either your
  authenticated mStudio user or the user specified with the --ssh-user flag.

  See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.

FLAG DESCRIPTIONS
  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.

    The SSH identity file to use for the connection. This file should contain an SSH private key and will be used to
    authenticate the connection to the server.

    You can also set this value by setting the MITTWALD_SSH_IDENTITY_FILE environment variable.

  --ssh-user=<value>  override the SSH user to connect with; if omitted, your own user will be used

    This flag can be used to override the SSH user that is used for a connection; be default, your own personal user
    will be used for this.

    You can also set this value by setting the MITTWALD_SSH_USER environment variable.
```

## `mw project ssh-user list`

List all SSH users for a project.

```
USAGE
  $ mw project ssh-user list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List all SSH users for a project.

ALIASES
  $ mw project ssh-user list

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw project update [PROJECT-ID]`

Update an existing project

```
USAGE
  $ mw project update [PROJECT-ID] [-q] [-p <value>] [--description <value>]

ARGUMENTS
  PROJECT-ID  ID or short ID of a project; this argument is optional if a default project is set in the context.

FLAGS
  -p, --project-id=<value>   ID or short ID of a project; this flag is optional if a default project is set in the
                             context
  -q, --quiet                suppress process output and only display a machine-readable summary.
      --description=<value>  Set the project description

DESCRIPTION
  Update an existing project

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```
