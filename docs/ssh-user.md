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
  $ mw ssh-user create --description <value> [--token <value>] [-p <value>] [-q] [--expires <value>] [--public-key
    <value>] [--password <value>]

FLAGS
  -p, --project-id=<value>   ID or short ID of a project; this flag is optional if a default project is set in the
                             context
  -q, --quiet                suppress process output and only display a machine-readable summary
      --description=<value>  (required) Set description for SSH user.
      --expires=<value>      an interval after which the SSH user expires (examples: 30m, 30d, 1y).
      --password=<value>     Password used for authentication
      --public-key=<value>   Public key used for authentication

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

_See code: [src/commands/ssh-user/create.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/ssh-user/create.ts)_

## `mw ssh-user delete SSH-USER-ID`

Delete an SSH user

```
USAGE
  $ mw ssh-user delete SSH-USER-ID [--token <value>] [-q] [-f]

ARGUMENTS
  SSH-USER-ID  The ID of the SSH user to delete

FLAGS
  -f, --force  do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Delete an SSH user

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

_See code: [src/commands/ssh-user/delete.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/ssh-user/delete.ts)_

## `mw ssh-user list`

List all SSH users for a project.

```
USAGE
  $ mw ssh-user list -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
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
  List all SSH users for a project.

ALIASES
  $ mw project ssh-user list

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

_See code: [src/commands/ssh-user/list.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/ssh-user/list.ts)_

## `mw ssh-user update SSH-USER-ID`

Update an existing SSH user

```
USAGE
  $ mw ssh-user update SSH-USER-ID [--token <value>] [-q] [--expires <value>] [--description <value>] [--public-key
    <value>] [--password <value>] [--enable | --disable]

ARGUMENTS
  SSH-USER-ID  The ID of the SSH user to update

FLAGS
  -q, --quiet                suppress process output and only display a machine-readable summary
      --description=<value>  Set description for SSH user.
      --disable              Disable the SSH user.
      --enable               Enable the SSH user.
      --expires=<value>      an interval after which the SSH user expires (examples: 30m, 30d, 1y).
      --password=<value>     Password used for authentication
      --public-key=<value>   Public key used for authentication

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Update an existing SSH user

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

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

_See code: [src/commands/ssh-user/update.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/ssh-user/update.ts)_
