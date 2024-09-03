`mw conversation`
=================

Manage your support cases

* [`mw conversation categories`](#mw-conversation-categories)
* [`mw conversation close [CONVERSATION-ID]`](#mw-conversation-close-conversation-id)
* [`mw conversation create`](#mw-conversation-create)
* [`mw conversation list`](#mw-conversation-list)
* [`mw conversation reply [CONVERSATION-ID]`](#mw-conversation-reply-conversation-id)
* [`mw conversation show [CONVERSATION-ID]`](#mw-conversation-show-conversation-id)
* [`mw conversation show2 CONVERSATIONID`](#mw-conversation-show2-conversationid)

## `mw conversation categories`

Get all conversation categories.

```
USAGE
  $ mw conversation categories [--columns <value> | -x] [--no-header | [--csv | --no-truncate]] [-o txt|json|yaml|csv |  | ]
    [--no-relative-dates]

FLAGS
  -o, --output=<option>    [default: txt] output in a more machine friendly format
                           <options: txt|json|yaml|csv>
  -x, --extended           show extra columns
      --columns=<value>    only show provided columns (comma-separated)
      --csv                output is csv format [alias: --output=csv]
      --no-header          hide table header from output
      --no-relative-dates  show dates in absolute format, not relative
      --no-truncate        do not truncate output to fit screen

DESCRIPTION
  Get all conversation categories.
```

## `mw conversation close [CONVERSATION-ID]`

Close a conversation

```
USAGE
  $ mw conversation close [CONVERSATION-ID]

ARGUMENTS
  CONVERSATION-ID  ID or short ID of a conversation; this argument is optional if a default conversation is set in the
                   context.

DESCRIPTION
  Close a conversation
```

## `mw conversation create`

Create a new conversation

```
USAGE
  $ mw conversation create --title <value> [--message <value> | --message-from <value>] [--editor <value>] [--category
    <value>]

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

DESCRIPTION
  Create a new conversation
```

## `mw conversation list`

Get all conversations the authenticated user has created or has access to.

```
USAGE
  $ mw conversation list [--columns <value> | -x] [--no-header | [--csv | --no-truncate]] [-o txt|json|yaml|csv |  | ]
    [--no-relative-dates]

FLAGS
  -o, --output=<option>    [default: txt] output in a more machine friendly format
                           <options: txt|json|yaml|csv>
  -x, --extended           show extra columns
      --columns=<value>    only show provided columns (comma-separated)
      --csv                output is csv format [alias: --output=csv]
      --no-header          hide table header from output
      --no-relative-dates  show dates in absolute format, not relative
      --no-truncate        do not truncate output to fit screen

DESCRIPTION
  Get all conversations the authenticated user has created or has access to.
```

## `mw conversation reply [CONVERSATION-ID]`

Reply to a conversation

```
USAGE
  $ mw conversation reply [CONVERSATION-ID] [--message <value> | --message-from <value>] [--editor <value>]

ARGUMENTS
  CONVERSATION-ID  ID or short ID of a conversation; this argument is optional if a default conversation is set in the
                   context.

FLAGS
  --editor=<value>        [default: vim] The editor to use when opening the message for editing; will respect your
                          EDITOR environment variable, and fall back on 'vim' if that is not set.
  --message=<value>       The body of the message to send; if neither this nor --message-from is given, an editor will
                          be opened to enter the message.
  --message-from=<value>  A file from which to read the message to send; may be '-' to read from stdin. If neither this
                          nor --message is given, an editor will be opened to enter the message.

DESCRIPTION
  Reply to a conversation
```

## `mw conversation show [CONVERSATION-ID]`

Show a conversation and message history

```
USAGE
  $ mw conversation show [CONVERSATION-ID]

ARGUMENTS
  CONVERSATION-ID  ID or short ID of a conversation; this argument is optional if a default conversation is set in the
                   context.

DESCRIPTION
  Show a conversation and message history
```

## `mw conversation show2 CONVERSATIONID`

```
USAGE
  $ mw conversation show2 CONVERSATIONID -o txt|json [--wait]

FLAGS
  -o, --output=<option>  (required) [default: txt] The output format to use; use 'txt' for a human readable text
                         representation, and 'json' for a machine-readable JSON representation.
                         <options: txt|json>
  --wait
```
