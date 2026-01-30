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
  $ mw login reset [--token <value>]

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Reset your local authentication state
```

_See code: [src/commands/login/reset.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/login/reset.ts)_

## `mw login status`

Checks your current authentication status

```
USAGE
  $ mw login status [--token <value>]

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Checks your current authentication status
```

_See code: [src/commands/login/status.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/login/status.ts)_

## `mw login token`

Authenticate using an API token

```
USAGE
  $ mw login token [--token <value>] [-q] [-o]

FLAGS
  -o, --overwrite  overwrite existing token file
  -q, --quiet      suppress process output and only display a machine-readable summary

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Authenticate using an API token

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

_See code: [src/commands/login/token.ts](https://github.com/mittwald/cli/blob/v1.13.1-beta.8/src/commands/login/token.ts)_
