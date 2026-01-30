`mw backup`
===========

Manage backups of your projects

* [`mw backup create`](#mw-backup-create)
* [`mw backup delete BACKUP-ID`](#mw-backup-delete-backup-id)
* [`mw backup download BACKUP-ID`](#mw-backup-download-backup-id)
* [`mw backup get BACKUP-ID`](#mw-backup-get-backup-id)
* [`mw backup list`](#mw-backup-list)
* [`mw backup schedule create`](#mw-backup-schedule-create)
* [`mw backup schedule delete BACKUP-SCHEDULE-ID`](#mw-backup-schedule-delete-backup-schedule-id)
* [`mw backup schedule list`](#mw-backup-schedule-list)
* [`mw backup schedule update BACKUP-SCHEDULE-ID`](#mw-backup-schedule-update-backup-schedule-id)

## `mw backup create`

Create a new backup of a project

```
USAGE
  $ mw backup create --expires <value> [--token <value>] [-q] [-p <value>] [--description <value>] [-w]
    [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>    ID or short ID of a project; this flag is optional if a default project is set in the
                              context
  -q, --quiet                 suppress process output and only display a machine-readable summary
  -w, --wait                  wait for the resource to be ready.
      --description=<value>   a description for the backup.
      --expires=<value>       (required) an interval after which the backup expires (examples: 30m, 30d, 1y).
      --wait-timeout=<value>  [default: 600s] the duration to wait for the resource to be ready (common units like 'ms',
                              's', 'm' are accepted).

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

ALIASES
  $ mw project backup create

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

_See code: [src/commands/backup/create.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/backup/create.ts)_

## `mw backup delete BACKUP-ID`

Delete a backup

```
USAGE
  $ mw backup delete BACKUP-ID [--token <value>] [-q] [-f]

ARGUMENTS
  BACKUP-ID  ID of a backup.

FLAGS
  -f, --force  do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Delete a backup

ALIASES
  $ mw project backup delete

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

_See code: [src/commands/backup/delete.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/backup/delete.ts)_

## `mw backup download BACKUP-ID`

Download a backup to your local disk

```
USAGE
  $ mw backup download BACKUP-ID [--token <value>] [-q] [--format tar|zip] [--password <value> | --generate-password
    | --prompt-password] [--resume --output <value>]

ARGUMENTS
  BACKUP-ID  ID of a backup.

FLAGS
  -q, --quiet              suppress process output and only display a machine-readable summary
      --format=<option>    [default: tar] the file format to download the backup in.
                           <options: tar|zip>
      --generate-password  generate a random password to encrypt the backup with.
      --output=<value>     the file to write the backup to; if omitted, the filename will be determined by the server.
      --password=<value>   the password to encrypt the backup with.
      --prompt-password    prompt for a password to encrypt the backup with.
      --resume             resume a previously interrupted download.

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Download a backup to your local disk

ALIASES
  $ mw project backup download

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

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

_See code: [src/commands/backup/download.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/backup/download.ts)_

## `mw backup get BACKUP-ID`

Show details of a backup.

```
USAGE
  $ mw backup get BACKUP-ID [--token <value>] [-o txt|json]

ARGUMENTS
  BACKUP-ID  ID of a backup.

FLAGS
  -o, --output=<option>  [default: txt] The output format to use; use 'txt' for a human readable text representation,
                         and 'json' for a machine-readable JSON representation.
                         <options: txt|json>

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Show details of a backup.

ALIASES
  $ mw project backup get
```

_See code: [src/commands/backup/get.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/backup/get.ts)_

## `mw backup list`

List Backups for a given Project.

```
USAGE
  $ mw backup list -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
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

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  List Backups for a given Project.

ALIASES
  $ mw project backup list

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

_See code: [src/commands/backup/list.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/backup/list.ts)_

## `mw backup schedule create`

Create a new backup schedule

```
USAGE
  $ mw backup schedule create --schedule <value> --ttl <value> [--token <value>] [-p <value>] [-q] [--description
  <value>]

FLAGS
  -p, --project-id=<value>   ID or short ID of a project; this flag is optional if a default project is set in the
                             context
  -q, --quiet                suppress process output and only display a machine-readable summary
      --description=<value>  Set the description for the backup schedule.
      --schedule=<value>     (required) Set the interval at which the backup should be scheduled.
      --ttl=<value>          (required) Define the backup retention period in days for backups created.

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --description=<value>  Set the description for the backup schedule.

    Set the description for the given backup schedule to be displayed in mStudio and with the list command.

  --schedule=<value>  Set the interval at which the backup should be scheduled.

    Must be specified as a cron schedule expression. Cannot be scheduled more often than once per hour. Defines the
    interval at which the backup creation will be executed.

  --ttl=<value>  Define the backup retention period in days for backups created.

    Must be specified as an amount of days between 7 and 400 in the format [amount]d - e.g. '7d' for 7 days. This will
    define the number of days the backup will be kept.
```

_See code: [src/commands/backup/schedule/create.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/backup/schedule/create.ts)_

## `mw backup schedule delete BACKUP-SCHEDULE-ID`

Delete a backup schedule

```
USAGE
  $ mw backup schedule delete BACKUP-SCHEDULE-ID [--token <value>] [-q] [-f]

ARGUMENTS
  BACKUP-SCHEDULE-ID  ID of schedule to delete

FLAGS
  -f, --force  do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Delete a backup schedule

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

_See code: [src/commands/backup/schedule/delete.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/backup/schedule/delete.ts)_

## `mw backup schedule list`

List backup schedules belonging to a given project.

```
USAGE
  $ mw backup schedule list -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
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

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  List backup schedules belonging to a given project.

ALIASES
  $ mw project backupschedule list

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

_See code: [src/commands/backup/schedule/list.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/backup/schedule/list.ts)_

## `mw backup schedule update BACKUP-SCHEDULE-ID`

Update an existing backup schedule

```
USAGE
  $ mw backup schedule update BACKUP-SCHEDULE-ID [--token <value>] [-q] [--description <value>] [--schedule <value>] [--ttl
    <value>]

ARGUMENTS
  BACKUP-SCHEDULE-ID  Define the backup schedule that is to be updated

FLAGS
  -q, --quiet                suppress process output and only display a machine-readable summary
      --description=<value>  Set the description for the backup schedule.
      --schedule=<value>     Set the interval at which the backup should be scheduled.
      --ttl=<value>          Define the backup retention period in days for backups created.

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Update an existing backup schedule

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --description=<value>  Set the description for the backup schedule.

    Set the description for the given backup schedule to be displayed in mStudio and with the list command.

  --schedule=<value>  Set the interval at which the backup should be scheduled.

    Must be specified as a cron schedule expression. Cannot be scheduled more often than once per hour. Defines the
    interval at which the backup creation will be executed.

  --ttl=<value>  Define the backup retention period in days for backups created.

    Must be specified as an amount of days between 7 and 400 in the format [amount]d - e.g. '7d' for 7 days. This will
    define the number of days the backup will be kept.
```

_See code: [src/commands/backup/schedule/update.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/backup/schedule/update.ts)_
