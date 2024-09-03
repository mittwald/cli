`mw ssh-user`
=============

Manage SSH users of your projects

* [`mw ssh-user create`](#mw-ssh-user-create)
* [`mw ssh-user delete SSH-USER-ID`](#mw-ssh-user-delete-ssh-user-id)
* [`mw ssh-user list`](#mw-ssh-user-list)
* [`mw ssh-user update SSH-USER-ID`](#mw-ssh-user-update-ssh-user-id)

## `mw ssh-user create`

Create a new SSH user

```
USAGE
  $ mw ssh-user create --description <value> [-p <value>] [-q] [--expires <value>] [--public-key <value>] [--password
    <value>]

FLAGS
  -p, --project-id=<value>   ID or short ID of a project; this flag is optional if a default project is set in the
                             context
  -q, --quiet                suppress process output and only display a machine-readable summary.
      --description=<value>  (required) Set description for SSH user.
      --expires=<value>      an interval after which the SSH user expires (examples: 30m, 30d, 1y).
      --password=<value>     Password used for authentication
      --public-key=<value>   Public key used for authentication

FLAG DESCRIPTIONS
  -p, --project-id=<value>

    ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --description=<value>  Set description for SSH user.

    Set the description for the given SSH user, which will be displayed in the mStudio as well as with the list command.

  --password=<value>  Password used for authentication

    Specify an authentication password. Using a password for authentication prevents this user from also using a public
    key for authentication.

  --public-key=<value>  Public key used for authentication

    Specifies the public key to use for authentication. The corresponding private key is required locally to connect
    through this user. Using a public key for authentication prevents this user from also using a password for
    authentication.
```

## `mw ssh-user delete SSH-USER-ID`

Delete an SSH user

```
USAGE
  $ mw ssh-user delete SSH-USER-ID [-q] [-f]

ARGUMENTS
  SSH-USER-ID  The ID of the SSH user to delete

FLAGS
  -f, --force  Do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Delete an SSH user

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw ssh-user list`

List all SSH users for a project.

```
USAGE
  $ mw ssh-user list [--columns <value> | -x] [--no-header | [--csv | --no-truncate]] [-o txt|json|yaml|csv |  | ]
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
  List all SSH users for a project.

ALIASES
  $ mw project ssh-user list

FLAG DESCRIPTIONS
  -p, --project-id=<value>

    ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw ssh-user update SSH-USER-ID`

Update an existing SSH user

```
USAGE
  $ mw ssh-user update SSH-USER-ID [-q] [--expires <value>] [--description <value>] [--public-key <value>]
    [--password <value>] [--enable | --disable]

ARGUMENTS
  SSH-USER-ID  The ID of the SSH user to update

FLAGS
  -q, --quiet                suppress process output and only display a machine-readable summary.
      --description=<value>  Set description for SSH user.
      --disable              Disable the SSH user.
      --enable               Enable the SSH user.
      --expires=<value>      an interval after which the SSH user expires (examples: 30m, 30d, 1y).
      --password=<value>     Password used for authentication
      --public-key=<value>   Public key used for authentication

DESCRIPTION
  Update an existing SSH user

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --description=<value>  Set description for SSH user.

    Set the description for the given SSH user, which will be displayed in the mStudio as well as with the list command.

  --disable  Disable the SSH user.

    Set the status of the SSH user to inactive. Access by this user will be disabled.

  --enable  Enable the SSH user.

    Set the status of the SSH user to active. Access by this user will be enabled.

  --password=<value>  Password used for authentication

    Specify an authentication password. Using a password for authentication prevents this user from also using a public
    key for authentication.

  --public-key=<value>  Public key used for authentication

    Specifies the public key to use for authentication. The corresponding private key is required locally to connect
    through this user. Using a public key for authentication prevents this user from also using a password for
    authentication.
```
