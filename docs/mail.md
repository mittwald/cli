`mw mail`
=========

Manage mailboxes and mail addresses in your projects

* [`mw mail address create`](#mw-mail-address-create)
* [`mw mail address delete ID`](#mw-mail-address-delete-id)
* [`mw mail address get ID`](#mw-mail-address-get-id)
* [`mw mail address list`](#mw-mail-address-list)
* [`mw mail address update MAILADDRESS-ID`](#mw-mail-address-update-mailaddress-id)
* [`mw mail deliverybox get ID`](#mw-mail-deliverybox-get-id)
* [`mw mail deliverybox list`](#mw-mail-deliverybox-list)

## `mw mail address create`

Create a new mail address

```
USAGE
  $ mw mail address create -a <value> [-p <value>] [-q] [--catch-all] [--enable-spam-protection] [--quota <value>]
    [--password <value>] [--random-password] [--forward-to <value>...]

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
  -p, --project-id=<value>

    ID or short ID of a project; this flag is optional if a default project is set in the context

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
  $ mw mail address get ID [-o json|yaml |  | ]

ARGUMENTS
  ID  id of the address you want to get

FLAGS
  -o, --output=<option>  output in a more machine friendly format
                         <options: json|yaml>

DESCRIPTION
  Get a specific mail address
```

## `mw mail address list`

Get all mail addresses for a project ID

```
USAGE
  $ mw mail address list [--columns <value> | -x] [--no-header | [--csv | --no-truncate]] [-o txt|json|yaml|csv |  | ]
    [--no-relative-dates] [-p <value>]

FLAGS
  -o, --output=<option>     [default: txt] output in a more machine friendly format
                            <options: txt|json|yaml|csv>
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -x, --extended            show extra columns
      --columns=<value>     only show provided columns (comma-separated)
      --csv                 output is csv format [alias: --output=csv]
      --no-header           hide table header from output
      --no-relative-dates   show dates in absolute format, not relative
      --no-truncate         do not truncate output to fit screen

DESCRIPTION
  Get all mail addresses for a project ID

FLAG DESCRIPTIONS
  -p, --project-id=<value>

    ID or short ID of a project; this flag is optional if a default project is set in the context

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

## `mw mail deliverybox get ID`

Get a specific delivery box

```
USAGE
  $ mw mail deliverybox get ID [-o json|yaml |  | ]

ARGUMENTS
  ID  ID of the deliverybox you want to retrieve

FLAGS
  -o, --output=<option>  output in a more machine friendly format
                         <options: json|yaml>

DESCRIPTION
  Get a specific delivery box
```

## `mw mail deliverybox list`

Get all deliveryboxes by project ID

```
USAGE
  $ mw mail deliverybox list [--columns <value> | -x] [--no-header | [--csv | --no-truncate]] [-o txt|json|yaml|csv |  | ]
    [--no-relative-dates] [-p <value>]

FLAGS
  -o, --output=<option>     [default: txt] output in a more machine friendly format
                            <options: txt|json|yaml|csv>
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -x, --extended            show extra columns
      --columns=<value>     only show provided columns (comma-separated)
      --csv                 output is csv format [alias: --output=csv]
      --no-header           hide table header from output
      --no-relative-dates   show dates in absolute format, not relative
      --no-truncate         do not truncate output to fit screen

DESCRIPTION
  Get all deliveryboxes by project ID

FLAG DESCRIPTIONS
  -p, --project-id=<value>

    ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```
