`mw user`
=========

Manage your own user account

* [`mw user api-token create`](#mw-user-api-token-create)
* [`mw user api-token get TOKEN-ID`](#mw-user-api-token-get-token-id)
* [`mw user api-token list`](#mw-user-api-token-list)
* [`mw user api-token revoke ID`](#mw-user-api-token-revoke-id)
* [`mw user get USER-ID`](#mw-user-get-user-id)
* [`mw user session get TOKEN-ID`](#mw-user-session-get-token-id)
* [`mw user session list`](#mw-user-session-list)
* [`mw user ssh-key create`](#mw-user-ssh-key-create)
* [`mw user ssh-key delete ID`](#mw-user-ssh-key-delete-id)
* [`mw user ssh-key get KEY-ID`](#mw-user-ssh-key-get-key-id)
* [`mw user ssh-key import`](#mw-user-ssh-key-import)
* [`mw user ssh-key list`](#mw-user-ssh-key-list)

## `mw user api-token create`

Create a new API token

```
USAGE
  $ mw user api-token create --description <value> --roles api_read|api_write... [-q] [--expires <value>]

FLAGS
  -q, --quiet                suppress process output and only display a machine-readable summary.
      --description=<value>  (required) description of the API token
      --expires=<value>      an interval after which the API token expires (examples: 30m, 30d, 1y).
      --roles=<option>...    (required) roles of the API token
                             <options: api_read|api_write>

DESCRIPTION
  Create a new API token

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw user api-token get TOKEN-ID`

Get a specific API token

```
USAGE
  $ mw user api-token get TOKEN-ID -o txt|json|yaml

ARGUMENTS
  TOKEN-ID  The ID of an API token

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get a specific API token
```

## `mw user api-token list`

List all API tokens of the user

```
USAGE
  $ mw user api-token list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
    [--csv-separator ,|;]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -x, --extended                show extended information
      --csv-separator=<option>  [default: ,] separator for CSV output (only relevant for CSV output)
                                <options: ,|;>
      --no-header               hide table header
      --no-relative-dates       show dates in absolute format, not relative (only relevant for txt output)
      --no-truncate             do not truncate output (only relevant for txt output)

DESCRIPTION
  List all API tokens of the user
```

## `mw user api-token revoke ID`

Revoke an API token

```
USAGE
  $ mw user api-token revoke ID [-q] [-f]

ARGUMENTS
  ID  ID of the API token to revoke

FLAGS
  -f, --force  Do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Revoke an API token

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw user get USER-ID`

Get profile information for a user.

```
USAGE
  $ mw user get USER-ID -o txt|json|yaml

ARGUMENTS
  USER-ID  [default: self] The user ID to get information for; defaults to the special value 'self', which references to
           the currently authenticated user.

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get profile information for a user.
```

## `mw user session get TOKEN-ID`

Get a specific session

```
USAGE
  $ mw user session get TOKEN-ID -o txt|json|yaml

ARGUMENTS
  TOKEN-ID  Token ID to identify the specific session

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get a specific session
```

## `mw user session list`

List all active sessions

```
USAGE
  $ mw user session list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
    [--csv-separator ,|;]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -x, --extended                show extended information
      --csv-separator=<option>  [default: ,] separator for CSV output (only relevant for CSV output)
                                <options: ,|;>
      --no-header               hide table header
      --no-relative-dates       show dates in absolute format, not relative (only relevant for txt output)
      --no-truncate             do not truncate output (only relevant for txt output)

DESCRIPTION
  List all active sessions
```

## `mw user ssh-key create`

Create and import a new SSH key

```
USAGE
  $ mw user ssh-key create [-q] [--expires <value>] [--output <value>] [--no-passphrase] [--comment <value>]

FLAGS
  -q, --quiet            suppress process output and only display a machine-readable summary.
      --comment=<value>  A comment for the SSH key.
      --expires=<value>  an interval after which the SSH key expires (examples: 30m, 30d, 1y).
      --no-passphrase    Use this flag to not set a passphrase for the SSH key.
      --output=<value>   [default: mstudio-cli] A filename in your ~/.ssh directory to write the SSH key to.

DESCRIPTION
  Create and import a new SSH key

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw user ssh-key delete ID`

Delete an SSH key

```
USAGE
  $ mw user ssh-key delete ID [-q] [-f]

ARGUMENTS
  ID  ID of the SSH key to be deleted.

FLAGS
  -f, --force  Do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Delete an SSH key

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw user ssh-key get KEY-ID`

Get a specific SSH key

```
USAGE
  $ mw user ssh-key get KEY-ID -o txt|json|yaml

ARGUMENTS
  KEY-ID  The ID of an SSH key

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get a specific SSH key
```

## `mw user ssh-key import`

Import an existing (local) SSH key

```
USAGE
  $ mw user ssh-key import [-q] [--expires <value>] [--input <value>]

FLAGS
  -q, --quiet            suppress process output and only display a machine-readable summary.
      --expires=<value>  an interval after which the SSH key expires (examples: 30m, 30d, 1y).
      --input=<value>    [default: id_rsa.pub] A filename in your ~/.ssh directory containing the key to import.

DESCRIPTION
  Import an existing (local) SSH key

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw user ssh-key list`

Get your stored ssh keys

```
USAGE
  $ mw user ssh-key list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
    [--csv-separator ,|;]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -x, --extended                show extended information
      --csv-separator=<option>  [default: ,] separator for CSV output (only relevant for CSV output)
                                <options: ,|;>
      --no-header               hide table header
      --no-relative-dates       show dates in absolute format, not relative (only relevant for txt output)
      --no-truncate             do not truncate output (only relevant for txt output)

DESCRIPTION
  Get your stored ssh keys
```
