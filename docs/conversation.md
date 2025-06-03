`mw conversation`
=================

Manage your support cases

* [`mw conversation create`](#mw-conversation-create)

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
