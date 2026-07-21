`mw experimental`
=================

Experimental features, which are not considered stable yet and might change without a major version bump

* [`mw experimental deploy`](#mw-experimental-deploy)

## `mw experimental deploy`

Deploys a new container.

```
USAGE
  $ mw experimental deploy [--token <value>] [-q] [-p <value>] [-w] [--wait-timeout <value>] [-e <value>...] [--env-file
    <value>...] [--uri-prefix <value>] [--service-name <value>] [--image-name <value>] [--image-tag <value>]
    [--build-only]

FLAGS
  -e, --env=<value>...        set environment variables in the container
  -p, --project-id=<value>    ID or short ID of a project; this flag is optional if a default project is set in the
                              context
  -q, --quiet                 suppress process output and only display a machine-readable summary
  -w, --wait                  wait for the resource to be ready.
      --build-only            build and push the image only
      --env-file=<value>...   read environment variables from a file
      --image-name=<value>    name of the Docker image to build and push
      --image-tag=<value>     tag of the Docker image to build and push
      --service-name=<value>  name of the container service to deploy
      --uri-prefix=<value>    [default: webapp] prefix for the generated default domain
      --wait-timeout=<value>  [default: 600s] the duration to wait for the resource to be ready (common units like 'ms',
                              's', 'm' are accepted).

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

EXAMPLES
  Deploy from current directory (auto-detects or creates Dockerfile)

    $ mw experimental deploy

  Deploy with explicit project context

    $ mw experimental deploy --project-id p-abc123

  Deploy with custom default domain prefix

    $ mw experimental deploy --uri-prefix myapp

  Deploy a second, parallel service with a custom image and service name

    $ mw experimental deploy --service-name my-feature --image-name my-app --image-tag feature

  Build and push image only, without deploying a service

    $ mw experimental deploy --build-only

FLAG DESCRIPTIONS
  -e, --env=<value>...  set environment variables in the container

    Format: KEY=VALUE. Multiple environment variables can be specified with multiple --env flags.

  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --build-only  build and push the image only

    Skips service deployment and domain creation after the image is pushed.

  --env-file=<value>...  read environment variables from a file

    The file should contain lines in the format KEY=VALUE. Multiple files can be specified with multiple --env-file
    flags.

  --image-name=<value>  name of the Docker image to build and push

    Defaults to 'app-image'.

  --image-tag=<value>  tag of the Docker image to build and push

    Defaults to 'latest'.

  --service-name=<value>  name of the container service to deploy

    Set this to run multiple parallel deployments in the same project. Defaults to 'app-<project-id>'.

  --uri-prefix=<value>  prefix for the generated default domain

    Defaults to 'webapp'.
```

