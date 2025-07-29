`mw conversation`
=================

Manage your support cases

* [`mw conversation categories`](#mw-conversation-categories)
* [`mw conversation close [CONVERSATION-ID]`](#mw-conversation-close-conversation-id)
* [`mw conversation create`](#mw-conversation-create)
* [`mw conversation list`](#mw-conversation-list)
* [`mw conversation reply [CONVERSATION-ID]`](#mw-conversation-reply-conversation-id)
* [`mw conversation show [CONVERSATION-ID]`](#mw-conversation-show-conversation-id)

## `mw conversation categories`

Get all conversation categories.

```
USAGE
  $ mw conversation categories -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
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
  Get all conversation categories.
```

## `mw conversation close [CONVERSATION-ID]`

Close a conversation

```
USAGE
  $ mw conversation close [CONVERSATION-ID] [--token <value>]

ARGUMENTS
  CONVERSATION-ID  ID of a conversation; this argument is optional if a default conversation is set in the context.

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Close a conversation
```

## `mw conversation create`

Create a new conversation

```
USAGE
  $ mw conversation create --title <value> [--token <value>] [--message <value> | --message-from <value>] [--editor
    <value>] [--category <value>]

FLAGS
  --category=<value>      [default: general] Category of the conversation; use the 'conversation categories' command to
                          list available categories
  --editor=<value>        [default: vim] The editor to use when opening the message for editing; will respect your
                          EDITOR environment variable, and fall back on 'vim' if that is not set.
  --message=<value>       The body of the message to send; if neither this nor --message-from is given, an editor will
                          be opened to enter the message.
  --message-from=<value>  A file from which to read the message to send; may be '-' to read from stdin. If neither this
                          nor --message is given, an editor will be opened to enter the message.
  --title=<value>         (required) Title of the conversation

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Create a new conversation
```

## `mw conversation list`

Get all conversations the authenticated user has created or has access to.

```
USAGE
  $ mw conversation list -o txt|json|yaml|csv|tsv [--token <value>] [-x] [--no-header] [--no-truncate]
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
  Get all conversations the authenticated user has created or has access to.
```

## `mw conversation reply [CONVERSATION-ID]`

Reply to a conversation

```
USAGE
  $ mw conversation reply [CONVERSATION-ID] [--token <value>] [--message <value> | --message-from <value>] [--editor
    <value>]

ARGUMENTS
  CONVERSATION-ID  ID of a conversation; this argument is optional if a default conversation is set in the context.

FLAGS
  --editor=<value>        [default: vim] The editor to use when opening the message for editing; will respect your
                          EDITOR environment variable, and fall back on 'vim' if that is not set.
  --message=<value>       The body of the message to send; if neither this nor --message-from is given, an editor will
                          be opened to enter the message.
  --message-from=<value>  A file from which to read the message to send; may be '-' to read from stdin. If neither this
                          nor --message is given, an editor will be opened to enter the message.

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Reply to a conversation
```

## `mw conversation show [CONVERSATION-ID]`

Show a conversation and message history

```
USAGE
  $ mw conversation show [CONVERSATION-ID] [--token <value>]

ARGUMENTS
  CONVERSATION-ID  ID of a conversation; this argument is optional if a default conversation is set in the context.

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.

DESCRIPTION
  Show a conversation and message history
```
