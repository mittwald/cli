`mw experimental`
=================

Experimental features, which are not considered stable yet and might change without a major version bump

* [`mw experimental deploy`](#mw-experimental-deploy)

## `mw experimental deploy`

Build the application in the current directory and deploy it as a container.

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
      --uri-prefix=<value>    prefix for the generated default domain
      --wait-timeout=<value>  [default: 600s] the duration to wait for the resource to be ready (common units like 'ms',
                              's', 'm' are accepted).

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Build the application in the current directory and deploy it as a container.

  The command runs the following steps:

  1. Checks that Docker and Railpack are installed locally.
  2. Makes sure that the project has a working private container registry. The registry runs as the "project-registry"
  container in a dedicated stack, is reachable at the "registry" subdomain of the project's default domain and is
  configured as a registry of the project. Missing or misconfigured parts are created or repaired; existing parts
  (including the stored images and the credentials) are reused. There is one such registry per project, shared by all
  deployments.
  3. Builds a container image from the current directory, using the Dockerfile in it if there is one, and Railpack
  otherwise. The container ports are taken from the EXPOSE instructions of the Dockerfile; a PORT variable passed with
  --env takes precedence. Without either, port 80 is used.
  4. Pushes the image to the project registry.
  5. Deploys the image as a container service. Each service runs in a stack of its own, named after the service; a
  service that already exists is updated in the stack it is in.
  6. Makes the service available at <uri-prefix>.<project-short-id>.project.space.

  With --build-only, the command stops after pushing the image.

  The service name defaults to the name of the current directory (lowercased, with every run of characters other than
  letters and digits replaced by a dash), and the image name and domain prefix default to the service name. Deploying
  from different directories therefore creates independent deployments, while deploying again from the same directory
  updates the existing one.

EXAMPLES
  Deploy from current directory (auto-detects or creates Dockerfile)

    $ mw experimental deploy

  Deploy with explicit project context

    $ mw experimental deploy --project-id p-abc123

  Deploy with custom default domain prefix

    $ mw experimental deploy --uri-prefix myapp

  Deploy the current directory as a second, independent service, e.g. for a feature branch

    $ mw experimental deploy --service-name my-app-feature --image-tag feature

  Build and push image only, without deploying a service

    $ mw experimental deploy --build-only

FLAG DESCRIPTIONS
  -e, --env=<value>...  set environment variables in the container

    Format: KEY=VALUE or KEY. If only KEY is provided, the value is resolved from the caller environment (exported
    variables only). Multiple environment variables can be specified with multiple --env flags.

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

    Defaults to the service name.

  --image-tag=<value>  tag of the Docker image to build and push

    Defaults to 'latest'.

  --service-name=<value>  name of the container service to deploy

    Also names the stack the service is deployed into. Defaults to the name of the current directory.

  --uri-prefix=<value>  prefix for the generated default domain

    Defaults to the service name.
```

