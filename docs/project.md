# `mw project`

Manage projects

* [`mw project create`](#mw-project-create)
* [`mw project delete PROJECT-ID`](#mw-project-delete-project-id)
* [`mw project get [PROJECT-ID]`](#mw-project-get-project-id)
* [`mw project list`](#mw-project-list)
* [`mw project ssh [PROJECT-ID]`](#mw-project-ssh-project-id)
* [`mw project update PROJECT-ID`](#mw-project-update-project-id)

## `mw project create`

Create a new project

```
USAGE
  $ mw project create [--token <value>] [-q] [--server-id <value>] [--version <value>] [--server-version <value>] [--description <value>] [--create-app] [--app-name <value>] [--app-version <value>] [--app-directory <value>] [--app-document-root <value>] [--ssh-user-name <value>] [--ssh-user-public-key <value>] [--ssh-user-password <value>] [--wait] [--wait-timeout <value>]

FLAGS
  -q, --quiet                        suppress process output and only display a machine-readable summary
      --app-directory=<value>        [default: /] directory of the app installation
      --app-document-root=<value>    [default: /public] document root of the app installation
      --app-name=<value>             name of the app to install
      --app-version=<value>          version of the app to install
      --create-app                   create an app installation
      --description=<value>          description of the project
      --server-id=<value>            ID of the server to create the project on
      --server-version=<value>       version of the server to create the project on
      --ssh-user-name=<value>        name of the SSH user to create
      --ssh-user-password=<value>    password of the SSH user to create
      --ssh-user-public-key=<value>  public key of the SSH user to create
      --token=<value>                API token to use for authentication (overrides environment and config file)
      --version=<value>              version of the project to create
      --wait                         wait for the project to be ready
      --wait-timeout=<value>         [default: 600s] timeout for waiting for the project to be ready

DESCRIPTION
  Create a new project

FLAG DESCRIPTIONS
  -q, --quiet

    suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary.
    When using mw non-interactively (e.g. in scripts), you can use this flag to
    easily get the IDs of created resources for further processing.

  --wait

    wait for the project to be ready

    This flag controls if the CLI should wait for the project to be ready before
    returning. This is useful when using the CLI in scripts.

  --wait-timeout=<value>

    timeout for waiting for the project to be ready

    This flag controls the maximum time the CLI should wait for the project to be
    ready before returning. This is only relevant when using the --wait flag.
```

## `mw project delete PROJECT-ID`

Delete a project

```
USAGE
  $ mw project delete [PROJECT-ID] [--token <value>] [-q] [-f]

ARGUMENTS
  PROJECT-ID  ID or short ID of a project; this argument is optional if a default project is set in the context.

FLAGS
  -f, --force          do not ask for confirmation
  -q, --quiet          suppress process output and only display a machine-readable summary
      --token=<value>  API token to use for authentication (overrides environment and config file)

DESCRIPTION
  Delete a project

FLAG DESCRIPTIONS
  -q, --quiet

    suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary.
    When using mw non-interactively (e.g. in scripts), you can use this flag to
    easily get the IDs of created resources for further processing.
```

## `mw project get [PROJECT-ID]`

Get details of a project

```
USAGE
  $ mw project get [PROJECT-ID] [--token <value>]

ARGUMENTS
  PROJECT-ID  ID or short ID of a project; this argument is optional if a default project is set in the context.

FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file)

DESCRIPTION
  Get details of a project
```

## `mw project list`

List projects

```
USAGE
  $ mw project list [--token <value>] [--columns <value> | ] [--filter <value>] [--no-header | [--csv | --no-truncate]] [--output csv|json|yaml | --extended] [--sort <value>] [--server-id <value>] [--extended]

FLAGS
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --extended            show extra columns
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine readable format
                        <options: csv|json|yaml>
  --server-id=<value>   ID of the server to list projects from
  --sort=<value>        property to sort by (prepend '-' for descending)
  --token=<value>       API token to use for authentication (overrides environment and config file)

DESCRIPTION
  List projects
```

## `mw project ssh [PROJECT-ID]`

Connect to a project via SSH

```
USAGE
  $ mw project ssh [PROJECT-ID] [--token <value>] [--ssh-user <value>] [--ssh-identity-file <value>] [--ssh-port <value>] [--ssh-host <value>] [--ssh-command <value>] [--ssh-disable-host-key-check]

ARGUMENTS
  PROJECT-ID  ID or short ID of a project; this argument is optional if a default project is set in the context.

FLAGS
  --ssh-command=<value>          SSH command to run
  --ssh-disable-host-key-check  disable host key checking
  --ssh-host=<value>             SSH host to connect to
  --ssh-identity-file=<value>    SSH identity file to use
  --ssh-port=<value>             SSH port to connect to
  --ssh-user=<value>             SSH user to connect as
  --token=<value>                API token to use for authentication (overrides environment and config file)

DESCRIPTION
  Connect to a project via SSH
```

## `mw project update PROJECT-ID`

Update a project

```
USAGE
  $ mw project update [PROJECT-ID] [--token <value>] [--description <value>]

ARGUMENTS
  PROJECT-ID  ID or short ID of a project; this argument is optional if a default project is set in the context.

FLAGS
  --description=<value>  description of the project
  --token=<value>        API token to use for authentication (overrides environment and config file)

DESCRIPTION
  Update a project
```