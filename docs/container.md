`mw container`
==============

Manage containers

* [`mw container cp SOURCE DEST`](#mw-container-cp-source-dest)
* [`mw container delete CONTAINER-ID`](#mw-container-delete-container-id)
* [`mw container exec CONTAINER-ID COMMAND`](#mw-container-exec-container-id-command)
* [`mw container list`](#mw-container-list)
* [`mw container logs CONTAINER-ID`](#mw-container-logs-container-id)
* [`mw container ls`](#mw-container-ls)
* [`mw container port-forward CONTAINER-ID [PORT]`](#mw-container-port-forward-container-id-port)
* [`mw container recreate CONTAINER-ID`](#mw-container-recreate-container-id)
* [`mw container restart CONTAINER-ID`](#mw-container-restart-container-id)
* [`mw container rm CONTAINER-ID`](#mw-container-rm-container-id)
* [`mw container run [--token <value>] [-q] [-p <value>] [-e <value>...] [--env-file <value>...] [--description <value>] [--entrypoint <value>] [--name <value>] [-p <value>...] [-P] [-v <value>...] IMAGE [COMMAND] [ARGS...]`](#mw-container-run---token-value--q--p-value--e-value---env-file-value---description-value---entrypoint-value---name-value--p-value--p--v-value-image-command-args)
* [`mw container ssh CONTAINER-ID`](#mw-container-ssh-container-id)
* [`mw container start CONTAINER-ID`](#mw-container-start-container-id)
* [`mw container stop CONTAINER-ID`](#mw-container-stop-container-id)
* [`mw container update CONTAINER-ID`](#mw-container-update-container-id)

## `mw container cp SOURCE DEST`

Copy files/folders between a container and the local filesystem

```
USAGE
  $ mw container cp SOURCE DEST [--token <value>] [-q] [--ssh-user <value>] [--ssh-identity-file <value>] [-p
    <value>] [-a] [-r]

ARGUMENTS
  SOURCE  Source path (either local path or CONTAINER:PATH)
  DEST    Destination path (either local path or CONTAINER:PATH)

FLAGS
  -a, --archive             archive mode (copy all uid/gid information)
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -q, --quiet               suppress process output and only display a machine-readable summary
  -r, --recursive           copy directories recursively

SSH CONNECTION FLAGS
  --ssh-identity-file=<value>  [env: MITTWALD_SSH_IDENTITY_FILE] the SSH identity file (private key) to use for public
                               key authentication.
  --ssh-user=<value>           [env: MITTWALD_SSH_USER] override the SSH user to connect with; if omitted, your own user
                               will be used

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Copy files/folders between a container and the local filesystem

  The syntax is similar to docker cp:
  - Copy from container to host: mw container cp CONTAINER:SRC_PATH DEST_PATH
  - Copy from host to container: mw container cp SRC_PATH CONTAINER:DEST_PATH

  Where CONTAINER can be a container ID, short ID, or service name.

EXAMPLES
  # Copy a file from container to current directory

    $ mw container cp mycontainer:/app/config.json .

  # Copy a file from host to container

    $ mw container cp ./local-file.txt mycontainer:/app/

  # Copy a directory recursively

    $ mw container cp mycontainer:/var/log ./logs

  # Copy with archive mode (preserve permissions)

    $ mw container cp -a mycontainer:/app/data ./backup

FLAG DESCRIPTIONS
  -a, --archive  archive mode (copy all uid/gid information)

    Preserve file permissions and ownership when copying

  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.

    The SSH identity file to use for the connection. This file should contain an SSH private key and will be used to
    authenticate the connection to the server.

    You can also set this value by setting the MITTWALD_SSH_IDENTITY_FILE environment variable.

  --ssh-user=<value>  override the SSH user to connect with; if omitted, your own user will be used

    This flag can be used to override the SSH user that is used for a connection; be default, your own personal user
    will be used for this.

    You can also set this value by setting the MITTWALD_SSH_USER environment variable.
```


## `mw container delete CONTAINER-ID`

Delete a container

```
USAGE
  $ mw container delete CONTAINER-ID [--token <value>] [-q] [-f] [-p <value>]

ARGUMENTS
  CONTAINER-ID  ID or short ID of the container to start

FLAGS
  -f, --force               do not ask for confirmation
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -q, --quiet               suppress process output and only display a machine-readable summary

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Delete a container

ALIASES
  $ mw container rm

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```


## `mw container exec CONTAINER-ID COMMAND`

Execute a command in a container via SSH non-interactively.

```
USAGE
  $ mw container exec CONTAINER-ID COMMAND [--token <value>] [--ssh-user <value>] [--ssh-identity-file <value>] [-p
    <value>] [-w <value>] [-e <value>...] [--shell <value>] [-q]

ARGUMENTS
  CONTAINER-ID  ID or short ID of the container to connect to
  COMMAND       Command to execute in the container

FLAGS
  -e, --env=<value>...      environment variables to set for the command (format: KEY=VALUE)
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -q, --quiet               disable informational output, only show command results
  -w, --workdir=<value>     working directory where the command will be executed
      --shell=<value>       [default: /bin/sh] shell to use for the SSH connection

SSH CONNECTION FLAGS
  --ssh-identity-file=<value>  [env: MITTWALD_SSH_IDENTITY_FILE] the SSH identity file (private key) to use for public
                               key authentication.
  --ssh-user=<value>           [env: MITTWALD_SSH_USER] override the SSH user to connect with; if omitted, your own user
                               will be used

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Execute a command in a container via SSH non-interactively.

  This command relies on connecting to your hosting environment via SSH. For this, it will use your systems SSH client
  under the hood, and will respect your SSH configuration in ~/.ssh/config.

  An exception to this is the 'User' configuration, which will be overridden by this command to either your
  authenticated mStudio user or the user specified with the --ssh-user flag.

  See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.

    The SSH identity file to use for the connection. This file should contain an SSH private key and will be used to
    authenticate the connection to the server.

    You can also set this value by setting the MITTWALD_SSH_IDENTITY_FILE environment variable.

  --ssh-user=<value>  override the SSH user to connect with; if omitted, your own user will be used

    This flag can be used to override the SSH user that is used for a connection; be default, your own personal user
    will be used for this.

    You can also set this value by setting the MITTWALD_SSH_USER environment variable.
```


## `mw container list`

List containers belonging to a project.

```
USAGE
  $ mw container list -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
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
  List containers belonging to a project.

ALIASES
  $ mw container ls

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```


## `mw container logs CONTAINER-ID`

Display logs of a specific container.

```
USAGE
  $ mw container logs CONTAINER-ID -o txt|json|yaml [--token <value>] [-p <value>] [--no-pager] [-t <value>]

ARGUMENTS
  CONTAINER-ID  ID of the container for which to get logs

FLAGS
  -o, --output=<option>     (required) [default: txt] output in a more machine friendly format
                            <options: txt|json|yaml>
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -t, --tail=<value>        Number of lines to show from the end of the logs (minimum: 1).
      --no-pager            Disable pager for output.

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Display logs of a specific container.

  This command prints the log output of a specific container. When this command is run in a terminal, the output is
  piped through a pager. The pager is determined by your PAGER environment variable, with defaulting to "less". You can
  disable this behavior with the --no-pager flag.

ALIASES
  $ mw container ls

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```


## `mw container ls`

List containers belonging to a project.

```
USAGE
  $ mw container ls -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
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
  List containers belonging to a project.

ALIASES
  $ mw container ls

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw container port-forward CONTAINER-ID [PORT]`

Forward a container port to a local port

```
USAGE
  $ mw container port-forward CONTAINER-ID [PORT] [--token <value>] [-q] [--ssh-user <value>] [--ssh-identity-file <value>]
    [-p <value>]

ARGUMENTS
  CONTAINER-ID  ID or short ID of the container to connect to
  [PORT]        Specifies the port mapping between your local machine and the container. Format:
                'local-port:container-port' or just 'port' (in which case the same port is used locally and in the
                container). If not specified, available ports will be detected automatically.

FLAGS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -q, --quiet               suppress process output and only display a machine-readable summary

SSH CONNECTION FLAGS
  --ssh-identity-file=<value>  [env: MITTWALD_SSH_IDENTITY_FILE] the SSH identity file (private key) to use for public
                               key authentication.
  --ssh-user=<value>           [env: MITTWALD_SSH_USER] override the SSH user to connect with; if omitted, your own user
                               will be used

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Forward a container port to a local port

  This command forwards a TCP port from a container to a local port on your machine. This allows you to connect to
  services running in the container as if they were running on your local machine.

  This command relies on connecting to your hosting environment via SSH. For this, it will use your systems SSH client
  under the hood, and will respect your SSH configuration in ~/.ssh/config.

  An exception to this is the 'User' configuration, which will be overridden by this command to either your
  authenticated mStudio user or the user specified with the --ssh-user flag.

  See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.

    The SSH identity file to use for the connection. This file should contain an SSH private key and will be used to
    authenticate the connection to the server.

    You can also set this value by setting the MITTWALD_SSH_IDENTITY_FILE environment variable.

  --ssh-user=<value>  override the SSH user to connect with; if omitted, your own user will be used

    This flag can be used to override the SSH user that is used for a connection; be default, your own personal user
    will be used for this.

    You can also set this value by setting the MITTWALD_SSH_USER environment variable.
```


## `mw container recreate CONTAINER-ID`

Recreates a container.

```
USAGE
  $ mw container recreate CONTAINER-ID [--token <value>] [-q] [-p <value>] [--pull] [--force]

ARGUMENTS
  CONTAINER-ID  ID or short ID of the container to restart

FLAGS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -q, --quiet               suppress process output and only display a machine-readable summary
      --force               also recreate the container when it is already up to date
      --pull                pull the container image before recreating the container

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
```


## `mw container restart CONTAINER-ID`

Restarts a container.

```
USAGE
  $ mw container restart CONTAINER-ID [--token <value>] [-q] [-p <value>]

ARGUMENTS
  CONTAINER-ID  ID or short ID of the container to restart

FLAGS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -q, --quiet               suppress process output and only display a machine-readable summary

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
```


## `mw container rm CONTAINER-ID`

Delete a container

```
USAGE
  $ mw container rm CONTAINER-ID [--token <value>] [-q] [-f] [-p <value>]

ARGUMENTS
  CONTAINER-ID  ID or short ID of the container to start

FLAGS
  -f, --force               do not ask for confirmation
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -q, --quiet               suppress process output and only display a machine-readable summary

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Delete a container

ALIASES
  $ mw container rm

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw container run [--token <value>] [-q] [-p <value>] [-e <value>...] [--env-file <value>...] [--description <value>] [--entrypoint <value>] [--name <value>] [-p <value>...] [-P] [-v <value>...] IMAGE [COMMAND] [ARGS...]`

Creates and starts a new container.

```
USAGE
  $ mw container run [--token <value>] [-q] [-p <value>] [-e <value>...] [--env-file <value>...] [--description
    <value>] [--entrypoint <value>] [--name <value>] [-p <value>...] [-P] [-v <value>...] IMAGE [COMMAND] [ARGS...]

ARGUMENTS
  IMAGE...      Can be specified as a repository/tag or repository@digest (e.g., 'ubuntu:20.04' or
                'alpine@sha256:abc123...'). If no tag is provided, 'latest' is assumed.
  [COMMAND...]  This overrides the default command specified in the container image. If omitted, the default command
                from the image will be used. For example, 'bash' or 'python app.py'.
  [ARGS...]     These are the runtime arguments passed to the command specified by the command parameter or the
                container's default command, not to the container itself. For example, if the command is 'echo', the
                args might be 'hello world'.

FLAGS
  -P, --publish-all          publish all ports that are defined in the image
  -e, --env=<value>...       set environment variables in the container
  -m, --memory=<value>       set memory limit for the container
  -p, --project-id=<value>   ID or short ID of a project; this flag is optional if a default project is set in the
                             context
  -q, --quiet                suppress process output and only display a machine-readable summary
  -v, --volume=<value>...    bind mount a volume to the container
      --cpus=<value>         set CPU limit for the container
      --create-volumes       automatically create named volumes that do not exist
      --description=<value>  add a descriptive label to the container
      --entrypoint=<value>   override the default entrypoint of the container image
      --env-file=<value>...  read environment variables from a file
      --name=<value>         assign a custom name to the container
      --publish=<value>...   publish a container's port(s)

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

FLAG DESCRIPTIONS
  -P, --publish-all  publish all ports that are defined in the image

    Automatically publish all ports that are exposed by the container image to random ports on the host.

  -e, --env=<value>...  set environment variables in the container

    Format: KEY=VALUE. Multiple environment variables can be specified with multiple --env flags.

  -m, --memory=<value>  set memory limit for the container

    Specify the maximum amount of memory the container can use (e.g., '512m', '1g', '2g'). This is equivalent to the
    docker run --memory flag or the deploy.resources.limits.memory field in docker-compose.

  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  -v, --volume=<value>...  bind mount a volume to the container

    This flag can be used to add volume mounts to the container. It can be used multiple times to mount multiple
    volumes.Needs to be in the format <host-path>:<container-path>. If you specify a file path as volume, this will
    mount a path from your hosting environment's file system (NOT your local file system) into the container. You can
    also specify a named volume, which needs to be created beforehand.

  --cpus=<value>  set CPU limit for the container

    Specify the number of CPUs available to the container (e.g., '0.5', '1', '2'). This is equivalent to the docker run
    --cpus flag or the deploy.resources.limits.cpus field in docker-compose.

  --create-volumes  automatically create named volumes that do not exist

    When enabled, any named volumes referenced in --volume flags that do not already exist will be automatically created
    before starting the container.

  --description=<value>  add a descriptive label to the container

    This helps identify the container's purpose or contents.

  --entrypoint=<value>  override the default entrypoint of the container image

    The entrypoint is the command that will be executed when the container starts. If omitted, the entrypoint defined in
    the image will be used.

  --env-file=<value>...  read environment variables from a file

    The file should contain lines in the format KEY=VALUE. Multiple files can be specified with multiple --env-file
    flags.

  --name=<value>  assign a custom name to the container

    This makes it easier to reference the container in subsequent commands. If omitted, a random name will be generated
    automatically.

  --publish=<value>...  publish a container's port(s)

    Expose a container's port within the cluster. Format: <cluster-port>:<container-port> or just <port> (in which case
    the same port is used for both cluster and container). For example, --publish 8080:80 maps port 80 in the container
    to port 8080 within the cluster, while --publish 8080 exposes port 8080 as port 8080. Use multiple --publish flags
    to publish multiple ports.

    NOTE: Please note that the usual shorthand -p is not supported for this flag, as it would conflict with the
    --project flag.
```


## `mw container ssh CONTAINER-ID`

Connect to a container via SSH

```
USAGE
  $ mw container ssh CONTAINER-ID [--token <value>] [--ssh-user <value>] [--ssh-identity-file <value>] [-p <value>]
    [--info] [--test] [--shell <value>]

ARGUMENTS
  CONTAINER-ID  ID or short ID of the container to connect to

FLAGS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
      --info                only print connection information, without actually connecting
      --shell=<value>       [default: /bin/sh] shell to use for the SSH connection
      --test                test connection and exit

SSH CONNECTION FLAGS
  --ssh-identity-file=<value>  [env: MITTWALD_SSH_IDENTITY_FILE] the SSH identity file (private key) to use for public
                               key authentication.
  --ssh-user=<value>           [env: MITTWALD_SSH_USER] override the SSH user to connect with; if omitted, your own user
                               will be used

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Connect to a container via SSH

  Establishes an interactive SSH connection to a container.

  This command is a wrapper around your systems SSH client, and will respect your SSH configuration in ~/.ssh/config.

  An exception to this is the 'User' configuration, which will be overridden by this command to either your
  authenticated mStudio user or the user specified with the --ssh-user flag.

  See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.

    The SSH identity file to use for the connection. This file should contain an SSH private key and will be used to
    authenticate the connection to the server.

    You can also set this value by setting the MITTWALD_SSH_IDENTITY_FILE environment variable.

  --ssh-user=<value>  override the SSH user to connect with; if omitted, your own user will be used

    This flag can be used to override the SSH user that is used for a connection; be default, your own personal user
    will be used for this.

    You can also set this value by setting the MITTWALD_SSH_USER environment variable.
```


## `mw container start CONTAINER-ID`

Starts a stopped container.

```
USAGE
  $ mw container start CONTAINER-ID [--token <value>] [-q] [-p <value>]

ARGUMENTS
  CONTAINER-ID  ID or short ID of the container to start

FLAGS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -q, --quiet               suppress process output and only display a machine-readable summary

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
```


## `mw container stop CONTAINER-ID`

Stops a running container.

```
USAGE
  $ mw container stop CONTAINER-ID [--token <value>] [-q] [-p <value>]

ARGUMENTS
  CONTAINER-ID  ID or short ID of the container to stop

FLAGS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -q, --quiet               suppress process output and only display a machine-readable summary

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
```


## `mw container update CONTAINER-ID`

Updates an existing container.

```
USAGE
  $ mw container update CONTAINER-ID [--token <value>] [-q] [-p <value>] [--image <value>] [-e <value>...] [--env-file
    <value>...] [--description <value>] [--entrypoint <value>] [--command <value>] [-p <value>...] [-P] [-v <value>...]
    [--recreate]

ARGUMENTS
  CONTAINER-ID  ID or short ID of the container to update

FLAGS
  -P, --publish-all          publish all ports that are defined in the image
  -e, --env=<value>...       set environment variables in the container
  -p, --project-id=<value>   ID or short ID of a project; this flag is optional if a default project is set in the
                             context
  -p, --publish=<value>...   update the container's port mappings
  -q, --quiet                suppress process output and only display a machine-readable summary
  -v, --volume=<value>...    update volume mounts for the container
      --command=<value>      update the command to run in the container
      --description=<value>  update the descriptive label of the container
      --entrypoint=<value>   override the entrypoint of the container
      --env-file=<value>...  read environment variables from a file
      --image=<value>        update the container image
      --recreate             recreate the container after updating

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Updates an existing container.

  Updates attributes of an existing container such as image, environment variables, etc.

FLAG DESCRIPTIONS
  -P, --publish-all  publish all ports that are defined in the image

    Automatically publish all ports that are exposed by the container image to random ports on the host.

  -e, --env=<value>...  set environment variables in the container

    Format: KEY=VALUE. Multiple environment variables can be specified with multiple --env flags.

  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -p, --publish=<value>...  update the container's port mappings

    Expose a container's port within the cluster. Format: <cluster-port>:<container-port> or just <port> (in which case
    the same port is used for both cluster and container). Use multiple -p flags to publish multiple ports.

  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  -v, --volume=<value>...  update volume mounts for the container

    This flag can be used to add volume mounts to the container. It can be used multiple times to mount multiple
    volumes.Needs to be in the format <host-path>:<container-path>. If you specify a file path as volume, this will
    mount a path from your hosting environment's file system (NOT your local file system) into the container. You can
    also specify a named volume, which needs to be created beforehand.

  --command=<value>  update the command to run in the container

    This overrides the default command specified in the container image.

  --description=<value>  update the descriptive label of the container

    This helps identify the container's purpose or contents.

  --entrypoint=<value>  override the entrypoint of the container

    The entrypoint is the command that will be executed when the container starts.

  --env-file=<value>...  read environment variables from a file

    The file should contain lines in the format KEY=VALUE. Multiple files can be specified with multiple --env-file
    flags.

  --image=<value>  update the container image

    Specify a new image to use for the container.

  --recreate  recreate the container after updating

    If set, the container will be automatically recreated after updating its configuration.
```

