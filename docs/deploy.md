`mw deploy`
===========

Deploys a new container.

* [`mw deploy`](#mw-deploy)

## `mw deploy`

Deploys a new container.

```
USAGE
  $ mw deploy [--token <value>] [-q] [-p <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>    ID or short ID of a project; this flag is optional if a default project is set in the
                              context
  -q, --quiet                 suppress process output and only display a machine-readable summary
  -w, --wait                  wait for the resource to be ready.
      --wait-timeout=<value>  [default: 600s] the duration to wait for the resource to be ready (common units like 'ms',
                              's', 'm' are accepted).

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

EXAMPLES
  Deploy from current directory (auto-detects or creates Dockerfile):

    $ mw deploy



  Deploy with explicit project context:

    $ mw deploy --project-id p-abc123

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

