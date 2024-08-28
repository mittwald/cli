`mw sftp-user`
==============

Manage SFTP users of your projects

* [`mw sftp-user delete SFTP-USER-ID`](#mw-sftp-user-delete-sftp-user-id)
* [`mw sftp-user list`](#mw-sftp-user-list)

## `mw sftp-user delete SFTP-USER-ID`

Delete an SFTP user

```
USAGE
  $ mw sftp-user delete SFTP-USER-ID [-q] [-f]

ARGUMENTS
  SFTP-USER-ID  The ID of the SFTP user to delete

FLAGS
  -f, --force  Do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Delete an SFTP user

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw sftp-user list`

List all SFTP users for a project.

```
USAGE
  $ mw sftp-user list [--columns <value> | -x] [--no-header | [--csv | --no-truncate]] [-o txt|json|yaml|csv |  | ]
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
  List all SFTP users for a project.

ALIASES
  $ mw project sftp-user list

FLAG DESCRIPTIONS
  -p, --project-id=<value>

    ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```
