`mw mail`
=========

Manage mailboxes and mail addresses in your projects

* [`mw mail address create`](#mw-mail-address-create)
* [`mw mail address delete ID`](#mw-mail-address-delete-id)
* [`mw mail address get ID`](#mw-mail-address-get-id)
* [`mw mail address list`](#mw-mail-address-list)
* [`mw mail address update MAILADDRESS-ID`](#mw-mail-address-update-mailaddress-id)
* [`mw mail deliverybox create`](#mw-mail-deliverybox-create)
* [`mw mail deliverybox delete ID`](#mw-mail-deliverybox-delete-id)
* [`mw mail deliverybox get ID`](#mw-mail-deliverybox-get-id)
* [`mw mail deliverybox list`](#mw-mail-deliverybox-list)
* [`mw mail deliverybox update MAILDELIVERYBOX-ID`](#mw-mail-deliverybox-update-maildeliverybox-id)

## `mw mail address create`

Create a new mail address

```
USAGE
  $ mw mail address create -a <value> [-p <value>] [-q] [--catch-all] [--enable-spam-protection] [--quota <value>]
    [--password <value> | --random-password] [--forward-to <value>...]

FLAGS
  -a, --address=<value>              (required) mail address
  -p, --project-id=<value>           ID or short ID of a project; this flag is optional if a default project is set in
                                     the context
  -q, --quiet                        suppress process output and only display a machine-readable summary.
      --catch-all                    make this a catch-all mail address
      --[no-]enable-spam-protection  enable spam protection for this mailbox
      --forward-to=<value>...        forward mail to other addresses
      --password=<value>             mailbox password
      --quota=<value>                [default: 1GiB] mailbox quota
      --random-password              generate a random password

DESCRIPTION
  Create a new mail address

  This command can be used to create a new mail address in a project.

  A mail address is either associated with a mailbox, or forwards to another address.

  To create a forwarding address, use the --forward-to flag. This flag can be used multiple times to forward to multiple
  addresses.

  When no --forward-to flag is given, the command will create a mailbox for the address. In this case, the --catch-all
  flag can be used to make the mailbox a catch-all mailbox.

  When running this command with the --quiet flag, the output will contain the ID of the newly created address.
  In addition, when run with --generated-password the output will be the ID of the newly created address, followed by a
  tab character and the generated password.

EXAMPLES
  Create non-interactively with password

    $ read -s PASSWORD && \
      mw mail address create --password $PASSWORD --address foo@bar.example

  Create non-interactively with random password

    $ mw mail address create --random-password --address foo@bar.example

  Create a forwarding address

    $ mw mail address create --address foo@bar.example --forward-to bar@bar.example --forward-to baz@bar.example

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --forward-to=<value>...  forward mail to other addresses

    This flag will cause the mailbox to forward all incoming mail to the given addresses. This will replace any
    forwarding addresses, that have already been set.

    Note: This flag is exclusive with --catch-all, --quota, --password and --random-password.

  --password=<value>  mailbox password

    This is the password that should be used for the mailbox; if omitted, the command will prompt interactively for a
    password.

    CAUTION: providing this flag may log your password in your shell history!

  --random-password  generate a random password

    This flag will cause the command to generate a random 32-character password for the mailbox; when running with
    --quiet, the address ID and the password will be printed to stdout, separated by a tab character.
```

## `mw mail address delete ID`

Delete a mail address

```
USAGE
  $ mw mail address delete ID [-q] [-f]

ARGUMENTS
  ID  Mail address ID

FLAGS
  -f, --force  Do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Delete a mail address

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw mail address get ID`

Get a specific mail address

```
USAGE
  $ mw mail address get ID -o txt|json|yaml

ARGUMENTS
  ID  id of the address you want to get

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get a specific mail address
```

## `mw mail address list`

Get all mail addresses for a project ID

```
USAGE
  $ mw mail address list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
    [--csv-separator ,|;] [-p <value>]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -p, --project-id=<value>      ID or short ID of a project; this flag is optional if a default project is set in the
                                context
  -x, --extended                show extended information
      --csv-separator=<option>  [default: ,] separator for CSV output (only relevant for CSV output)
                                <options: ,|;>
      --no-header               hide table header
      --no-relative-dates       show dates in absolute format, not relative (only relevant for txt output)
      --no-truncate             do not truncate output (only relevant for txt output)

DESCRIPTION
  Get all mail addresses for a project ID

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw mail address update MAILADDRESS-ID`

Update a mail address

```
USAGE
  $ mw mail address update MAILADDRESS-ID [-q] [-a <value>] [--catch-all] [--quota <value>] [--password <value>]
    [--random-password] [--forward-to <value>...]

ARGUMENTS
  MAILADDRESS-ID  ID or mail address of a mailaddress

FLAGS
  -a, --address=<value>        mail address
  -q, --quiet                  suppress process output and only display a machine-readable summary.
      --[no-]catch-all         Change this from or to a catch-all mail address; omit to leave unchanged
      --forward-to=<value>...  forward mail to other addresses
      --password=<value>       mailbox password
      --quota=<value>          mailbox quota in mebibytes
      --random-password        generate a random password

DESCRIPTION
  Update a mail address

  This command can be used to update a mail address in a project.

  A mail address is either associated with a mailbox, or forwards to another address.

  To set forwarding addresses, use the --forward-to flag.

  Use the --catch-all flag to make the mailbox a catch-all mailbox.
  Use the --no-catch-all flag to make the mailbox a regular mailbox.

  When running this command with --generated-password the output will be the newly generated and set password.

EXAMPLES
  Update non-interactively with password

    $ read -s PASSWORD && \
      mw mail address update --password $PASSWORD --address foo@bar.example

  Update non-interactively with random password

    $ mw mail address update --random-password --address foo@bar.example

  Set forwarding addresses

    $ mw mail address update --address foo@bar.example --forward-to bar@bar.example --forward-to baz@bar.example

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --forward-to=<value>...  forward mail to other addresses

    This flag will cause the mailbox to forward all incoming mail to the given addresses. This will replace any
    forwarding addresses, that have already been set.

    Note: This flag is exclusive with --catch-all, --no-catch-all, --quota, --password and --random-password.

  --password=<value>  mailbox password

    If set, the mailbox will be updated to this password. If omitted, the password will remain unchanged.

    CAUTION: providing this flag may log your password in your shell history!

  --random-password  generate a random password

    This flag will cause the command to generate a random 32-character password for the mailbox; when running with
    --quiet, the password will be printed to stdout.
```

## `mw mail deliverybox create`

Create a new mail delivery box

```
USAGE
  $ mw mail deliverybox create -d <value> [-p <value>] [-q] [--password <value> | --random-password]

FLAGS
  -d, --description=<value>  (required) mail delivery box description
  -p, --project-id=<value>   ID or short ID of a project; this flag is optional if a default project is set in the
                             context
  -q, --quiet                suppress process output and only display a machine-readable summary.
      --password=<value>     delivery box password
      --random-password      generate a random password

DESCRIPTION
  Create a new mail delivery box

  This command can be used to create a new mail delivery box in a project.

  When running this command with the --quiet flag, the output will contain the ID of the newly created delivery box.
  In addition, when run with --generated-password the output will be the ID of the newly created delivery box, followed
  by a tab character and the generated password.

EXAMPLES
  Create non-interactively with password

    $ read -s PASSWORD && \
      mw mail deliverybox create --password $PASSWORD --description 'my personal delivery box'

  Create non-interactively with random password

    $ mw mail deliverybox create --random-password --description 'my personal delivery box'

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --password=<value>  delivery box password

    This is the password that should be used for the delivery box; if omitted, the command will prompt interactively for
    a password.

    CAUTION: providing this flag may log your password in your shell history!

  --random-password  generate a random password

    This flag will cause the command to generate a random 32-character password for the delivery box; when running with
    --quiet, the delivery box ID and the password will be printed to stdout, separated by a tab character.
```

## `mw mail deliverybox delete ID`

Delete a mail delivery box

```
USAGE
  $ mw mail deliverybox delete ID [-q] [-f]

ARGUMENTS
  ID  Mail delivery box ID

FLAGS
  -f, --force  Do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Delete a mail delivery box

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw mail deliverybox get ID`

Get a specific delivery box

```
USAGE
  $ mw mail deliverybox get ID -o txt|json|yaml

ARGUMENTS
  ID  ID of the delivery box you want to retrieve

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get a specific delivery box
```

## `mw mail deliverybox list`

Get all delivery boxes by project ID

```
USAGE
  $ mw mail deliverybox list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
    [--csv-separator ,|;] [-p <value>]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -p, --project-id=<value>      ID or short ID of a project; this flag is optional if a default project is set in the
                                context
  -x, --extended                show extended information
      --csv-separator=<option>  [default: ,] separator for CSV output (only relevant for CSV output)
                                <options: ,|;>
      --no-header               hide table header
      --no-relative-dates       show dates in absolute format, not relative (only relevant for txt output)
      --no-truncate             do not truncate output (only relevant for txt output)

DESCRIPTION
  Get all delivery boxes by project ID

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw mail deliverybox update MAILDELIVERYBOX-ID`

Update a mail delivery box

```
USAGE
  $ mw mail deliverybox update MAILDELIVERYBOX-ID [-q] [--description <value>] [--password <value>] [--random-password]

ARGUMENTS
  MAILDELIVERYBOX-ID  ID or short ID of a maildeliverybox.

FLAGS
  -q, --quiet                suppress process output and only display a machine-readable summary.
      --description=<value>  delivery box description
      --password=<value>     delivery box password
      --random-password      generate a random password

DESCRIPTION
  Update a mail delivery box

  This command can be used to update a mail delivery box in a project.

  A mail delivery box is either associated with a mailbox, or forwards to another address.

  When running this command with --generated-password the output will be the newly generated and set password.

EXAMPLES
  Update non-interactively with password

    $ read -s PASSWORD && \
      mw mail deliverybox update --password $PASSWORD --description 'my personal delivery box'

  Update non-interactively with random password

    $ mw mail deliverybox update --random-password --description 'my personal delivery box'

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --description=<value>  delivery box description

    If set, the delivery description will be updated to this password. If omitted, the description will remain
    unchanged.

  --password=<value>  delivery box password

    If set, the delivery box will be updated to this password. If omitted, the password will remain unchanged.

    CAUTION: providing this flag may log your password in your shell history!

  --random-password  generate a random password

    This flag will cause the command to generate a random 32-character password for the delivery box; when running with
    --quiet, the password will be printed to stdout.
```
