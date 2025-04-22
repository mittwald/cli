`mw contributor`
================

Commands for mStudio marketplace contributors

* [`mw contributor extension deploy EXTENSION-MANIFEST`](#mw-contributor-extension-deploy-extension-manifest)
* [`mw contributor extension init EXTENSION-MANIFEST`](#mw-contributor-extension-init-extension-manifest)
* [`mw contributor extension publish EXTENSION-MANIFEST`](#mw-contributor-extension-publish-extension-manifest)
* [`mw contributor extension withdraw EXTENSION-MANIFEST`](#mw-contributor-extension-withdraw-extension-manifest)

## `mw contributor extension deploy EXTENSION-MANIFEST`

Deploy an extension manifest to the marketplace

```
USAGE
  $ mw contributor extension deploy EXTENSION-MANIFEST [-q] [--create]

ARGUMENTS
  EXTENSION-MANIFEST  [default: ./mstudio-extension.yaml] file path to the extension manifest (as YAML or JSON)

FLAGS
  -q, --quiet        suppress process output and only display a machine-readable summary.
      --[no-]create  create the extension if it does not exist

DESCRIPTION
  Deploy an extension manifest to the marketplace

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw contributor extension init EXTENSION-MANIFEST`

Init a new extension manifest file

```
USAGE
  $ mw contributor extension init EXTENSION-MANIFEST [-q] [--overwrite]

ARGUMENTS
  EXTENSION-MANIFEST  [default: ./mstudio-extension.yaml] file path to the extension manifest (as YAML or JSON)

FLAGS
  -q, --quiet      suppress process output and only display a machine-readable summary.
      --overwrite  overwrite an existing extension manifest if found

DESCRIPTION
  Init a new extension manifest file

  This command will create a new extension manifest file. It only operates on your local file system; afterwards, use
  the 'deploy' command to upload the manifest to the marketplace.

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw contributor extension publish EXTENSION-MANIFEST`

Publish an extension on the marketplace

```
USAGE
  $ mw contributor extension publish EXTENSION-MANIFEST [-q]

ARGUMENTS
  EXTENSION-MANIFEST  [default: ./mstudio-extension.yaml] file path to the extension manifest (as YAML or JSON)

FLAGS
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Publish an extension on the marketplace

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw contributor extension withdraw EXTENSION-MANIFEST`

Withdraw an extension from the marketplace

```
USAGE
  $ mw contributor extension withdraw EXTENSION-MANIFEST --reason <value> [-q]

ARGUMENTS
  EXTENSION-MANIFEST  [default: ./mstudio-extension.yaml] file path to the extension manifest (as YAML or JSON)

FLAGS
  -q, --quiet           suppress process output and only display a machine-readable summary.
      --reason=<value>  (required) Reason for withdrawal

DESCRIPTION
  Withdraw an extension from the marketplace

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```
