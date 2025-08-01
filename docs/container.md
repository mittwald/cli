`mw container`
==============

Delete a container

* [`mw container delete CONTAINER-ID`](#mw-container-delete-container-id)
* [`mw container list`](#mw-container-list)
* [`mw container logs CONTAINER-ID`](#mw-container-logs-container-id)
* [`mw container ls`](#mw-container-ls)
* [`mw container recreate CONTAINER-ID`](#mw-container-recreate-container-id)
* [`mw container restart CONTAINER-ID`](#mw-container-restart-container-id)
* [`mw container rm CONTAINER-ID`](#mw-container-rm-container-id)
* [`mw container run IMAGE [COMMAND] [ARGS]`](#mw-container-run-image-command-args)
* [`mw container start CONTAINER-ID`](#mw-container-start-container-id)
* [`mw container stop CONTAINER-ID`](#mw-container-stop-container-id)
* [`mw container update CONTAINER-ID`](#mw-container-update-container-id)

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
  $ mw container logs CONTAINER-ID -o txt|json|yaml [--token <value>] [-p <value>] [--no-pager]

ARGUMENTS
  CONTAINER-ID  ID of the container for which to get logs

FLAGS
  -o, --output=<option>     (required) [default: txt] output in a more machine friendly format
                            <options: txt|json|yaml>
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
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

## `mw container run IMAGE [COMMAND] [ARGS]`

Creates and starts a new container.

```
USAGE
  $ mw container run IMAGE [COMMAND] [ARGS] [--token <value>] [-q] [-p <value>] [-e <value>...] [--env-file
    <value>...] [--description <value>] [--entrypoint <value>] [--name <value>] [-p <value>...] [-P] [-v <value>...]

ARGUMENTS
  IMAGE    Can be specified as a repository/tag or repository@digest (e.g., 'ubuntu:20.04' or
           'alpine@sha256:abc123...'). If no tag is provided, 'latest' is assumed.
  COMMAND  This overrides the default command specified in the container image. If omitted, the default command from the
           image will be used. For example, 'bash' or 'python app.py'.
  ARGS     These are the runtime arguments passed to the command specified by the command parameter or the container's
           default command, not to the container itself. For example, if the command is 'echo', the args might be 'hello
           world'.

FLAGS
  -P, --publish-all          publish all ports that are defined in the image
  -e, --env=<value>...       set environment variables in the container
  -p, --project-id=<value>   ID or short ID of a project; this flag is optional if a default project is set in the
                             context
  -p, --publish=<value>...   publish a container's port(s) to the host
  -q, --quiet                suppress process output and only display a machine-readable summary
  -v, --volume=<value>...    bind mount a volume to the container
      --description=<value>  add a descriptive label to the container
      --entrypoint=<value>   override the default entrypoint of the container image
      --env-file=<value>...  read environment variables from a file
      --name=<value>         assign a custom name to the container

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

FLAG DESCRIPTIONS
  -P, --publish-all  publish all ports that are defined in the image

    Automatically publish all ports that are exposed by the container image to random ports on the host.

  -e, --env=<value>...  set environment variables in the container

    Format: KEY=VALUE. Multiple environment variables can be specified with multiple --env flags.

  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -p, --publish=<value>...  publish a container's port(s) to the host

    Map a container's port to a port on the host system. Format: <host-port>:<container-port> or just <container-port>
    (in which case the host port will be automatically assigned). For example, -p 8080:80 maps port 80 in the container
    to port 8080 on the host. Use multiple -p flags to publish multiple ports.

  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  -v, --volume=<value>...  bind mount a volume to the container

    This flag can be used to add volume mounts to the container. It can be used multiple times to mount multiple
    volumes.Needs to be in the format <host-path>:<container-path>. If you specify a file path as volume, this will
    mount a path from your hosting environment's file system (NOT your local file system) into the container. You can
    also specify a named volume, which needs to be created beforehand.

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

    Map a container's port to a port on the host system. Format: <host-port>:<container-port> or just <container-port>
    (in which case the host port will be automatically assigned). Use multiple -p flags to publish multiple ports.

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
