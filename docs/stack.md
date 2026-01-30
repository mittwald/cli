`mw stack`
==========

Manage container stacks

* [`mw stack delete [STACK-ID]`](#mw-stack-delete-stack-id)
* [`mw stack deploy`](#mw-stack-deploy)
* [`mw stack list`](#mw-stack-list)
* [`mw stack ls`](#mw-stack-ls)
* [`mw stack ps`](#mw-stack-ps)
* [`mw stack rm [STACK-ID]`](#mw-stack-rm-stack-id)
* [`mw stack up`](#mw-stack-up)

## `mw stack delete [STACK-ID]`

Delete a container stack

```
USAGE
  $ mw stack delete [STACK-ID] [--token <value>] [-q] [-f] [-v]

ARGUMENTS
  [STACK-ID]  ID of a stack; this argument is optional if a default stack is set in the context.

FLAGS
  -f, --force         do not ask for confirmation
  -q, --quiet         suppress process output and only display a machine-readable summary
  -v, --with-volumes  also include remove volumes in removal

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Delete a container stack

ALIASES
  $ mw stack rm

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```


## `mw stack deploy`

Deploys a docker-compose compatible file to a mittwald container stack

```
USAGE
  $ mw stack deploy [--token <value>] [-s <value>] [-q] [-c <value> | --from-template <value>] [--env-file <value>]

FLAGS
  -c, --compose-file=<value>   [default: ./docker-compose.yml] path to a compose file, or "-" to read from stdin
  -q, --quiet                  suppress process output and only display a machine-readable summary
  -s, --stack-id=<value>       ID of a stack; this flag is optional if a default stack is set in the context
      --env-file=<value>       [default: ./.env] alternative path to file with environment variables
      --from-template=<value>  deploy from a GitHub template (e.g., mittwald/n8n)

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Deploys a docker-compose compatible file to a mittwald container stack

ALIASES
  $ mw stack up

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  -s, --stack-id=<value>  ID of a stack; this flag is optional if a default stack is set in the context

    May contain a ID of a stack; you can also use the "mw context set --stack-id=<VALUE>" command to persistently set a
    default stack for all commands that accept this flag.

  --from-template=<value>  deploy from a GitHub template (e.g., mittwald/n8n)

    Fetch and deploy a stack from a GitHub template repository. Template names are automatically converted to repository
    names by prefixing "stack-template-" to the name part.

    For example, "mittwald/n8n" resolves to the repository "mittwald/stack-template-n8n". The command fetches both
    docker-compose.yml and .env files from the main branch.

    Environment variable precedence (from lowest to highest):
    1. Template .env file (if present in the repository)
    2. System environment variables (process.env)
    3. Local --env-file (if specified)

    This flag is mutually exclusive with --compose-file.
```


## `mw stack list`

List container stacks for a given project.

```
USAGE
  $ mw stack list -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
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
  List container stacks for a given project.

ALIASES
  $ mw stack ls

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```


## `mw stack ls`

List container stacks for a given project.

```
USAGE
  $ mw stack ls -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
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
  List container stacks for a given project.

ALIASES
  $ mw stack ls

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw stack ps`

List all services within a given container stack.

```
USAGE
  $ mw stack ps -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
    [--no-relative-dates] [--csv-separator ,|;] [-s <value>]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -s, --stack-id=<value>        ID of a stack; this flag is optional if a default stack is set in the context
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
  List all services within a given container stack.

FLAG DESCRIPTIONS
  -s, --stack-id=<value>  ID of a stack; this flag is optional if a default stack is set in the context

    May contain a ID of a stack; you can also use the "mw context set --stack-id=<VALUE>" command to persistently set a
    default stack for all commands that accept this flag.
```


## `mw stack rm [STACK-ID]`

Delete a container stack

```
USAGE
  $ mw stack rm [STACK-ID] [--token <value>] [-q] [-f] [-v]

ARGUMENTS
  [STACK-ID]  ID of a stack; this argument is optional if a default stack is set in the context.

FLAGS
  -f, --force         do not ask for confirmation
  -q, --quiet         suppress process output and only display a machine-readable summary
  -v, --with-volumes  also include remove volumes in removal

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Delete a container stack

ALIASES
  $ mw stack rm

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw stack up`

Deploys a docker-compose compatible file to a mittwald container stack

```
USAGE
  $ mw stack up [--token <value>] [-s <value>] [-q] [-c <value> | --from-template <value>] [--env-file <value>]

FLAGS
  -c, --compose-file=<value>   [default: ./docker-compose.yml] path to a compose file, or "-" to read from stdin
  -q, --quiet                  suppress process output and only display a machine-readable summary
  -s, --stack-id=<value>       ID of a stack; this flag is optional if a default stack is set in the context
      --env-file=<value>       [default: ./.env] alternative path to file with environment variables
      --from-template=<value>  deploy from a GitHub template (e.g., mittwald/n8n)

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Deploys a docker-compose compatible file to a mittwald container stack

ALIASES
  $ mw stack up

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  -s, --stack-id=<value>  ID of a stack; this flag is optional if a default stack is set in the context

    May contain a ID of a stack; you can also use the "mw context set --stack-id=<VALUE>" command to persistently set a
    default stack for all commands that accept this flag.

  --from-template=<value>  deploy from a GitHub template (e.g., mittwald/n8n)

    Fetch and deploy a stack from a GitHub template repository. Template names are automatically converted to repository
    names by prefixing "stack-template-" to the name part.

    For example, "mittwald/n8n" resolves to the repository "mittwald/stack-template-n8n". The command fetches both
    docker-compose.yml and .env files from the main branch.

    Environment variable precedence (from lowest to highest):
    1. Template .env file (if present in the repository)
    2. System environment variables (process.env)
    3. Local --env-file (if specified)

    This flag is mutually exclusive with --compose-file.
```
