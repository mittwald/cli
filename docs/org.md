`mw org`
========

Manage your organizations, and also any kinds of user memberships concerning these organizations.

* [`mw org delete [ORG-ID]`](#mw-org-delete-org-id)
* [`mw org get [ORG-ID]`](#mw-org-get-org-id)
* [`mw org invite`](#mw-org-invite)
* [`mw org invite list`](#mw-org-invite-list)
* [`mw org invite list-own`](#mw-org-invite-list-own)
* [`mw org invite revoke INVITE-ID`](#mw-org-invite-revoke-invite-id)
* [`mw org list`](#mw-org-list)
* [`mw org membership list`](#mw-org-membership-list)
* [`mw org membership list-own`](#mw-org-membership-list-own)
* [`mw org membership revoke MEMBERSHIP-ID`](#mw-org-membership-revoke-membership-id)

## `mw org delete [ORG-ID]`

Delete an organization

```
USAGE
  $ mw org delete [ORG-ID] [--token <value>] [-q] [-f]

ARGUMENTS
  [ORG-ID]  ID or short ID of an org; this argument is optional if a default org is set in the context.

FLAGS
  -f, --force  do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Delete an organization

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```


## `mw org get [ORG-ID]`

Get an organization profile.

```
USAGE
  $ mw org get [ORG-ID] [--token <value>] [-o txt|json]

ARGUMENTS
  [ORG-ID]  ID or short ID of an org; this argument is optional if a default org is set in the context.

FLAGS
  -o, --output=<option>  [default: txt] The output format to use; use 'txt' for a human readable text representation,
                         and 'json' for a machine-readable JSON representation.
                         <options: txt|json>

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Get an organization profile.
```


## `mw org invite`

Invite a user to an organization.

```
USAGE
  $ mw org invite --email <value> [--token <value>] [-o <value>] [-q] [--role owner|member|accountant]
    [--message <value>] [--expires <value>]

FLAGS
  -o, --org-id=<value>   ID or short ID of an org; this flag is optional if a default org is set in the context
  -q, --quiet            suppress process output and only display a machine-readable summary
      --email=<value>    (required) The email address of the user to invite.
      --expires=<value>  an interval after which the invitation expires (examples: 30m, 30d, 1y).
      --message=<value>  A message to include in the invitation email.
      --role=<option>    [default: member] The role of the user to invite.
                         <options: owner|member|accountant>

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Invite a user to an organization.

FLAG DESCRIPTIONS
  -o, --org-id=<value>  ID or short ID of an org; this flag is optional if a default org is set in the context

    May contain a short ID or a full ID of an org; you can also use the "mw context set --org-id=<VALUE>" command to
    persistently set a default org for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```


## `mw org invite list`

List all invites for an organization.

```
USAGE
  $ mw org invite list -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
    [--no-relative-dates] [--csv-separator ,|;] [-o <value>]

FLAGS
  -o, --org-id=<value>          ID or short ID of an org; this flag is optional if a default org is set in the context
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
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
  List all invites for an organization.

FLAG DESCRIPTIONS
  -o, --org-id=<value>  ID or short ID of an org; this flag is optional if a default org is set in the context

    May contain a short ID or a full ID of an org; you can also use the "mw context set --org-id=<VALUE>" command to
    persistently set a default org for all commands that accept this flag.
```


## `mw org invite list-own`

List all organization invites for the executing user.

```
USAGE
  $ mw org invite list-own -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
    [--no-relative-dates] [--csv-separator ,|;]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
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
  List all organization invites for the executing user.
```


## `mw org invite revoke INVITE-ID`

Revoke an invite to an organization

```
USAGE
  $ mw org invite revoke INVITE-ID [--token <value>] [-q]

ARGUMENTS
  INVITE-ID  The ID of the invite to revoke

FLAGS
  -q, --quiet  suppress process output and only display a machine-readable summary

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Revoke an invite to an organization

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```


## `mw org list`

Get all organizations the authenticated user has access to.

```
USAGE
  $ mw org list -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
    [--no-relative-dates] [--csv-separator ,|;]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
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
  Get all organizations the authenticated user has access to.
```


## `mw org membership list`

List all memberships belonging to an organization.

```
USAGE
  $ mw org membership list -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
    [--no-relative-dates] [--csv-separator ,|;] [-o <value>]

FLAGS
  -o, --org-id=<value>          ID or short ID of an org; this flag is optional if a default org is set in the context
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
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
  List all memberships belonging to an organization.

FLAG DESCRIPTIONS
  -o, --org-id=<value>  ID or short ID of an org; this flag is optional if a default org is set in the context

    May contain a short ID or a full ID of an org; you can also use the "mw context set --org-id=<VALUE>" command to
    persistently set a default org for all commands that accept this flag.
```


## `mw org membership list-own`

List all organization memberships for the executing user.

```
USAGE
  $ mw org membership list-own -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
    [--no-relative-dates] [--csv-separator ,|;]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
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
  List all organization memberships for the executing user.
```


## `mw org membership revoke MEMBERSHIP-ID`

Revoke a user's membership to an organization

```
USAGE
  $ mw org membership revoke MEMBERSHIP-ID [--token <value>] [-q]

ARGUMENTS
  MEMBERSHIP-ID  The ID of the membership to revoke

FLAGS
  -q, --quiet  suppress process output and only display a machine-readable summary

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Revoke a user's membership to an organization

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

