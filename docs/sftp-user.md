`mw sftp-user`
==============

Manage SFTP users of your projects

* [`mw sftp-user create`](#mw-sftp-user-create)
* [`mw sftp-user delete SFTP-USER-ID`](#mw-sftp-user-delete-sftp-user-id)
* [`mw sftp-user list`](#mw-sftp-user-list)
* [`mw sftp-user update SFTP-USER-ID`](#mw-sftp-user-update-sftp-user-id)

## `mw sftp-user create`

Create a new SFTP user

```
USAGE
  $ mw sftp-user create --description <value> --directories <value>... [-p <value>] [-q] [--expires <value>]
    [--public-key <value>] [--password <value>] [--access-level read|full]

FLAGS
  -p, --project-id=<value>      ID or short ID of a project; this flag is optional if a default project is set in the
                                context
  -q, --quiet                   suppress process output and only display a machine-readable summary.
      --access-level=<option>   Set access level permissions for the SFTP user.
                                <options: read|full>
      --description=<value>     (required) Set description for SFTP user.
      --directories=<value>...  (required) Specify directories to restrict this SFTP users access to.
      --expires=<value>         an interval after which the SFTP User expires (examples: 30m, 30d, 1y).
      --password=<value>        Password used for authentication
      --public-key=<value>      Public key used for authentication

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --access-level=read|full  Set access level permissions for the SFTP user.

    Must be specified as either read or full. Grant the user either read-only or full file read and write privileges.

  --description=<value>  Set description for SFTP user.

    Set the description for the given SFTP user, which will be displayed in the mStudio as well as with the list
    command.

  --directories=<value>...  Specify directories to restrict this SFTP users access to.

    Specified as a list of directories, will restrict access for this user to the specified directories.

  --password=<value>  Password used for authentication

    Specify an authentication password. Using a password for authentication prevents this user from also using a public
    key for authentication.

  --public-key=<value>  Public key used for authentication

    Specifies the public key to use for authentication. The corresponding private key is required locally to connect
    through this user. Using a public key for authentication prevents this user from also using a password for
    authentication.
```

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
  $ mw sftp-user list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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

## `mw sftp-user update SFTP-USER-ID`

Update an existing SFTP user

```
USAGE
  $ mw sftp-user update SFTP-USER-ID [-q] [--expires <value>] [--description <value>] [--public-key <value> |
    --password <value>] [--access-level read|full] [--directories <value>...] [--enable | --disable]

ARGUMENTS
  SFTP-USER-ID  The ID of the SFTP user to update

FLAGS
  -q, --quiet                   suppress process output and only display a machine-readable summary.
      --access-level=<option>   Set access level permissions for the SFTP user.
                                <options: read|full>
      --description=<value>     Set description for SFTP user.
      --directories=<value>...  Specify directories to restrict this SFTP users access to.
      --disable                 Disable the SFTP user.
      --enable                  Enable the SFTP user.
      --expires=<value>         an interval after which the SFTP user expires (examples: 30m, 30d, 1y).
      --password=<value>        Password used for authentication
      --public-key=<value>      Public key used for authentication

DESCRIPTION
  Update an existing SFTP user

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --access-level=read|full  Set access level permissions for the SFTP user.

    Must be specified as either read or full. Grant the user either read-only or full file read and write privileges.

  --description=<value>  Set description for SFTP user.

    Set the description for the given SFTP user, which will be displayed in the mStudio as well as with the list
    command.

  --directories=<value>...  Specify directories to restrict this SFTP users access to.

    Specified as a list of directories, will restrict access for this user to the specified directories.

  --disable  Disable the SFTP user.

    Set the status of the SFTP user to inactive. Access by this user will be disable.

  --enable  Enable the SFTP user.

    Set the status of the SFTP user to active. Access by this user will be enabled.

  --password=<value>  Password used for authentication

    Specify an authentication password. Using a password for authentication prevents this user from also using a public
    key for authentication.

  --public-key=<value>  Public key used for authentication

    Specifies the public key to use for authentication. The corresponding private key is required locally to connect
    through this user. Using a public key for authentication prevents this user from also using a password for
    authentication.
```
