`mw backup`
===========

Manage backups of your projects

* [`mw backup create`](#mw-backup-create)
* [`mw backup delete BACKUP-ID`](#mw-backup-delete-backup-id)
* [`mw backup download BACKUP-ID`](#mw-backup-download-backup-id)
* [`mw backup get BACKUP-ID`](#mw-backup-get-backup-id)
* [`mw backup list`](#mw-backup-list)
* [`mw backup schedule list`](#mw-backup-schedule-list)

## `mw backup create`

Create a new backup of a project

```
USAGE
  $ mw backup create --expires <value> [-q] [-p <value>] [--description <value>] [-w] [--wait-timeout <value>]

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
  -p, --project-id=<value>

    ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw backup delete BACKUP-ID`

Delete a backup

```
USAGE
  $ mw backup delete BACKUP-ID [-q] [-f]

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

## `mw backup download BACKUP-ID`

Download a backup to your local disk

```
USAGE
  $ mw backup download BACKUP-ID [-q] [--format tar|zip] [--password <value> | --generate-password |
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

## `mw backup get BACKUP-ID`

Show details of a backup.

```
USAGE
  $ mw backup get BACKUP-ID [-o json|yaml |  | ]

ARGUMENTS
  BACKUP-ID  ID or short ID of a backup.

FLAGS
  -o, --output=<option>  output in a more machine friendly format
                         <options: json|yaml>

DESCRIPTION
  Show details of a backup.

ALIASES
  $ mw project backup get
```

## `mw backup list`

List Backups for a given Project.

```
USAGE
  $ mw backup list [--columns <value> | -x] [--no-header | [--csv | --no-truncate]] [-o txt|json|yaml|csv |  | ]
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
  List Backups for a given Project.

ALIASES
  $ mw project backup list

FLAG DESCRIPTIONS
  -p, --project-id=<value>

    ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw backup schedule list`

List backup schedules belonging to a given project.

```
USAGE
  $ mw backup schedule list [--columns <value> | -x] [--no-header | [--csv | --no-truncate]] [-o txt|json|yaml|csv |  | ]
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
  List backup schedules belonging to a given project.

ALIASES
  $ mw project backupschedule list

FLAG DESCRIPTIONS
  -p, --project-id=<value>

    ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```
