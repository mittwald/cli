`mw login`
==========

Manage your client authentication

* [`mw login reset`](#mw-login-reset)
* [`mw login status`](#mw-login-status)
* [`mw login token`](#mw-login-token)

## `mw login reset`

Reset your local authentication state

```
USAGE
  $ mw login reset

DESCRIPTION
  Reset your local authentication state
```

## `mw login status`

Checks your current authentication status

```
USAGE
  $ mw login status

DESCRIPTION
  Checks your current authentication status
```

## `mw login token`

Authenticate using an API token

```
USAGE
  $ mw login token [-q] [-o]

FLAGS
  -o, --overwrite  overwrite existing token file
  -q, --quiet      suppress process output and only display a machine-readable summary.

DESCRIPTION
  Authenticate using an API token

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```
