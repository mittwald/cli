`mw database`
=============

Manage databases (like MySQL and Redis) in your projects

* [`mw database mysql charsets`](#mw-database-mysql-charsets)
* [`mw database mysql create`](#mw-database-mysql-create)
* [`mw database mysql delete DATABASE-ID`](#mw-database-mysql-delete-database-id)
* [`mw database mysql dump DATABASE-ID`](#mw-database-mysql-dump-database-id)
* [`mw database mysql get DATABASE-ID`](#mw-database-mysql-get-database-id)
* [`mw database mysql import DATABASE-ID`](#mw-database-mysql-import-database-id)
* [`mw database mysql list`](#mw-database-mysql-list)
* [`mw database mysql phpmyadmin DATABASE-ID`](#mw-database-mysql-phpmyadmin-database-id)
* [`mw database mysql port-forward DATABASE-ID`](#mw-database-mysql-port-forward-database-id)
* [`mw database mysql shell DATABASE-ID`](#mw-database-mysql-shell-database-id)
* [`mw database mysql user create`](#mw-database-mysql-user-create)
* [`mw database mysql user delete USER-ID`](#mw-database-mysql-user-delete-user-id)
* [`mw database mysql user get ID`](#mw-database-mysql-user-get-id)
* [`mw database mysql user list`](#mw-database-mysql-user-list)
* [`mw database mysql user update USER-ID`](#mw-database-mysql-user-update-user-id)
* [`mw database mysql versions`](#mw-database-mysql-versions)
* [`mw database redis create`](#mw-database-redis-create)
* [`mw database redis get ID`](#mw-database-redis-get-id)
* [`mw database redis list`](#mw-database-redis-list)
* [`mw database redis shell DATABASE-ID`](#mw-database-redis-shell-database-id)
* [`mw database redis versions`](#mw-database-redis-versions)

## `mw database mysql charsets`

List available MySQL character sets and collations, optionally filtered by a MySQLVersion.

```
USAGE
  $ mw database mysql charsets -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List available MySQL character sets and collations, optionally filtered by a MySQLVersion.
```

## `mw database mysql create`

Create a new MySQL database

```
USAGE
  $ mw database mysql create -d <value> --version <value> [-p <value>] [-q] [--collation <value>] [--character-set <value>]
    [--user-password <value>] [--user-external] [--user-access-level full|readonly]

FLAGS
  -d, --description=<value>         (required) a description for the database
  -p, --project-id=<value>          ID or short ID of a project; this flag is optional if a default project is set in
                                    the context
  -q, --quiet                       suppress process output and only display a machine-readable summary.
      --character-set=<value>       [default: utf8mb4] the character set to use
      --collation=<value>           [default: utf8mb4_unicode_ci] the collation to use
      --user-access-level=<option>  [default: full] the access level preset for the default user
                                    <options: full|readonly>
      --user-external               enable external access for default user
      --user-password=<value>       the password to use for the default user (env: MYSQL_PWD)
      --version=<value>             (required) the MySQL version to use

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --version=<value>  the MySQL version to use

    Use the "database mysql versions" command to list available versions
```

## `mw database mysql delete DATABASE-ID`

Delete a MySQL database

```
USAGE
  $ mw database mysql delete DATABASE-ID [-q] [-f]

ARGUMENTS
  DATABASE-ID  The ID or name of the database

FLAGS
  -f, --force  Do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Delete a MySQL database

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw database mysql dump DATABASE-ID`

Create a dump of a MySQL database

```
USAGE
  $ mw database mysql dump DATABASE-ID -o <value> [-q] [-p <value>] [--temporary-user] [--ssh-user <value>]
    [--ssh-identity-file <value>] [--gzip]

ARGUMENTS
  DATABASE-ID  The ID or name of the database

FLAGS
  -o, --output=<value>          (required) the output file to write the dump to ("-" for stdout)
  -p, --mysql-password=<value>  the password to use for the MySQL user (env: MYSQL_PWD)
  -q, --quiet                   suppress process output and only display a machine-readable summary.
      --gzip                    compress the dump with gzip
      --[no-]temporary-user     create a temporary user for the dump

SSH CONNECTION FLAGS
  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.
  --ssh-user=<value>           override the SSH user to connect with; if omitted, your own user will be used

DESCRIPTION
  Create a dump of a MySQL database

  This command creates a dump of a MySQL database via mysqldump and saves it to a local file.

  This command relies on connecting to your hosting environment via SSH. For this, it will use your systems SSH client
  under the hood, and will respect your SSH configuration in ~/.ssh/config.

  An exception to this is the 'User' configuration, which will be overridden by this command to either your
  authenticated mStudio user or the user specified with the --ssh-user flag.

  See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.

FLAG DESCRIPTIONS
  -o, --output=<value>  the output file to write the dump to ("-" for stdout)

    The output file to write the dump to. You can specify "-" or "/dev/stdout" to write the dump directly to STDOUT; in
    this case, you might want to use the --quiet/-q flag to supress all other output, so that you can pipe the mysqldump
    for further processing.

  -p, --mysql-password=<value>  the password to use for the MySQL user (env: MYSQL_PWD)

    The password to use for the MySQL user. If not provided, the environment variable MYSQL_PWD will be used. If that is
    not set either, the command will interactively ask for the password.

    NOTE: This is a security risk, as the password will be visible in the process list of your system, and will be
    visible in your Shell history. It is recommended to use the environment variable instead.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --gzip  compress the dump with gzip

    Compress the dump with gzip. This is useful for large databases, as it can significantly reduce the size of the
    dump.

  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.

    The SSH identity file to use for the connection. This file should contain an SSH private key and will be used to
    authenticate the connection to the server.

    You can also set this value by setting the MITTWALD_SSH_IDENTITY_FILE environment variable.

  --ssh-user=<value>  override the SSH user to connect with; if omitted, your own user will be used

    This flag can be used to override the SSH user that is used for a connection; be default, your own personal user
    will be used for this.

    You can also set this value by setting the MITTWALD_SSH_USER environment variable.

  --[no-]temporary-user  create a temporary user for the dump

    Create a temporary user for this operation. This user will be deleted after the operation has completed. This is
    useful if you want to work with a database that is not accessible from the outside.

    If this flag is disabled, you will need to specify the password of the default user; either via the --mysql-password
    flag or via the MYSQL_PWD environment variable.
```

## `mw database mysql get DATABASE-ID`

Get a MySQLDatabase.

```
USAGE
  $ mw database mysql get DATABASE-ID -o txt|json|yaml

ARGUMENTS
  DATABASE-ID  The ID or name of the database

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get a MySQLDatabase.
```

## `mw database mysql import DATABASE-ID`

Imports a dump of a MySQL database

```
USAGE
  $ mw database mysql import DATABASE-ID -i <value> [-q] [-p <value>] [--temporary-user] [--ssh-user <value>]
    [--ssh-identity-file <value>] [--gzip]

ARGUMENTS
  DATABASE-ID  The ID or name of the database

FLAGS
  -i, --input=<value>           (required) the input file from which to read the dump ("-" for stdin)
  -p, --mysql-password=<value>  the password to use for the MySQL user (env: MYSQL_PWD)
  -q, --quiet                   suppress process output and only display a machine-readable summary.
      --gzip                    uncompress the dump with gzip
      --[no-]temporary-user     create a temporary user for the dump

SSH CONNECTION FLAGS
  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.
  --ssh-user=<value>           override the SSH user to connect with; if omitted, your own user will be used

DESCRIPTION
  Imports a dump of a MySQL database

  This command imports a mysqldump file from your local filesystem into a MySQL database.

  This command relies on connecting to your hosting environment via SSH. For this, it will use your systems SSH client
  under the hood, and will respect your SSH configuration in ~/.ssh/config.

  An exception to this is the 'User' configuration, which will be overridden by this command to either your
  authenticated mStudio user or the user specified with the --ssh-user flag.

  See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.

FLAG DESCRIPTIONS
  -i, --input=<value>  the input file from which to read the dump ("-" for stdin)

    The input file from which to read the dump to. You can specify "-" or "/dev/stdin" to read the dump directly from
    STDIN.

  -p, --mysql-password=<value>  the password to use for the MySQL user (env: MYSQL_PWD)

    The password to use for the MySQL user. If not provided, the environment variable MYSQL_PWD will be used. If that is
    not set either, the command will interactively ask for the password.

    NOTE: This is a security risk, as the password will be visible in the process list of your system, and will be
    visible in your Shell history. It is recommended to use the environment variable instead.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --gzip  uncompress the dump with gzip

    Uncompress the dump with gzip while importing. This is useful for large databases, as it can significantly reduce
    the size of the dump.

  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.

    The SSH identity file to use for the connection. This file should contain an SSH private key and will be used to
    authenticate the connection to the server.

    You can also set this value by setting the MITTWALD_SSH_IDENTITY_FILE environment variable.

  --ssh-user=<value>  override the SSH user to connect with; if omitted, your own user will be used

    This flag can be used to override the SSH user that is used for a connection; be default, your own personal user
    will be used for this.

    You can also set this value by setting the MITTWALD_SSH_USER environment variable.

  --[no-]temporary-user  create a temporary user for the dump

    Create a temporary user for this operation. This user will be deleted after the operation has completed. This is
    useful if you want to work with a database that is not accessible from the outside.

    If this flag is disabled, you will need to specify the password of the default user; either via the --mysql-password
    flag or via the MYSQL_PWD environment variable.
```

## `mw database mysql list`

List MySQLDatabases belonging to a Project.

```
USAGE
  $ mw database mysql list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List MySQLDatabases belonging to a Project.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw database mysql phpmyadmin DATABASE-ID`

Open phpMyAdmin for a MySQL database.

```
USAGE
  $ mw database mysql phpmyadmin DATABASE-ID

ARGUMENTS
  DATABASE-ID  The ID or name of the database
```

## `mw database mysql port-forward DATABASE-ID`

Forward the TCP port of a MySQL database to a local port

```
USAGE
  $ mw database mysql port-forward DATABASE-ID [-q] [--ssh-user <value>] [--ssh-identity-file <value>] [--port <value>]

ARGUMENTS
  DATABASE-ID  The ID or name of the database

FLAGS
  -q, --quiet         suppress process output and only display a machine-readable summary.
      --port=<value>  [default: 3306] The local TCP port to forward to

SSH CONNECTION FLAGS
  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.
  --ssh-user=<value>           override the SSH user to connect with; if omitted, your own user will be used

DESCRIPTION
  Forward the TCP port of a MySQL database to a local port

  This command forwards the TCP port of a MySQL database to a local port on your machine. This allows you to connect to
  the database as if it were running on your local machine.

  This command relies on connecting to your hosting environment via SSH. For this, it will use your systems SSH client
  under the hood, and will respect your SSH configuration in ~/.ssh/config.

  An exception to this is the 'User' configuration, which will be overridden by this command to either your
  authenticated mStudio user or the user specified with the --ssh-user flag.

  See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.

    The SSH identity file to use for the connection. This file should contain an SSH private key and will be used to
    authenticate the connection to the server.

    You can also set this value by setting the MITTWALD_SSH_IDENTITY_FILE environment variable.

  --ssh-user=<value>  override the SSH user to connect with; if omitted, your own user will be used

    This flag can be used to override the SSH user that is used for a connection; be default, your own personal user
    will be used for this.

    You can also set this value by setting the MITTWALD_SSH_USER environment variable.
```

## `mw database mysql shell DATABASE-ID`

Connect to a MySQL database via the MySQL shell

```
USAGE
  $ mw database mysql shell DATABASE-ID [-q] [--ssh-user <value>] [--ssh-identity-file <value>] [-p <value>]

ARGUMENTS
  DATABASE-ID  The ID or name of the database

FLAGS
  -p, --mysql-password=<value>  the password to use for the MySQL user (env: MYSQL_PWD)
  -q, --quiet                   suppress process output and only display a machine-readable summary.

SSH CONNECTION FLAGS
  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.
  --ssh-user=<value>           override the SSH user to connect with; if omitted, your own user will be used

DESCRIPTION
  Connect to a MySQL database via the MySQL shell

  This command opens an interactive mysql shell to a MySQL database.

  This command relies on connecting to your hosting environment via SSH. For this, it will use your systems SSH client
  under the hood, and will respect your SSH configuration in ~/.ssh/config.

  An exception to this is the 'User' configuration, which will be overridden by this command to either your
  authenticated mStudio user or the user specified with the --ssh-user flag.

  See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.

FLAG DESCRIPTIONS
  -p, --mysql-password=<value>  the password to use for the MySQL user (env: MYSQL_PWD)

    The password to use for the MySQL user. If not provided, the environment variable MYSQL_PWD will be used. If that is
    not set either, the command will interactively ask for the password.

    NOTE: This is a security risk, as the password will be visible in the process list of your system, and will be
    visible in your Shell history. It is recommended to use the environment variable instead.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.

    The SSH identity file to use for the connection. This file should contain an SSH private key and will be used to
    authenticate the connection to the server.

    You can also set this value by setting the MITTWALD_SSH_IDENTITY_FILE environment variable.

  --ssh-user=<value>  override the SSH user to connect with; if omitted, your own user will be used

    This flag can be used to override the SSH user that is used for a connection; be default, your own personal user
    will be used for this.

    You can also set this value by setting the MITTWALD_SSH_USER environment variable.
```

## `mw database mysql user create`

Create a new MySQL user

```
USAGE
  $ mw database mysql user create --database-id <value> --access-level readonly|full --description <value> --password <value>
    [-q] [--access-ip-mask <value> --enable-external-access]

FLAGS
  -q, --quiet                   suppress process output and only display a machine-readable summary.
      --access-ip-mask=<value>  IP to restrict external access to.
      --access-level=<option>   (required) Set the access level permissions for the SFTP user.
                                <options: readonly|full>
      --database-id=<value>     (required) MySQL database ID to create a user for.
      --description=<value>     (required) Set the description for the MySQL user.
      --enable-external-access  Enable external access for this MySQL user.
      --password=<value>        (required) Password used for authentication

DESCRIPTION
  Create a new MySQL user

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --access-ip-mask=<value>  IP to restrict external access to.

    If specified as IPv4, external access will be restricted to only the specified IP addresses when external access is
    enabled.

  --access-level=readonly|full  Set the access level permissions for the SFTP user.

    Must be specified as either readonly or full. Grant the user either read-only or full file read and write access to
    files.

  --database-id=<value>  MySQL database ID to create a user for.

    Can be specified as UUID or shortId. The user will be created for the specified database.

  --description=<value>  Set the description for the MySQL user.

    Set the description for the specified MySQL user to be displayed in mStudio and with the list command.

  --enable-external-access  Enable external access for this MySQL user.

    By default, external access is disabled for newly created MySQL users. Using this flag will enable external access
    for this user on creation. External access can be restricted to specific IP addresses using the 'access-ip-mask'
    flag.

  --password=<value>  Password used for authentication

    Specify a password to use for authentication when connecting to the database with this user.
```

## `mw database mysql user delete USER-ID`

Delete a MySQL user

```
USAGE
  $ mw database mysql user delete USER-ID [-q] [-f]

ARGUMENTS
  USER-ID  ID of the MySQL user to delete.

FLAGS
  -f, --force  Do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Delete a MySQL user

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw database mysql user get ID`

Get a MySQL user.

```
USAGE
  $ mw database mysql user get ID -o txt|json|yaml

ARGUMENTS
  ID  ID of the MySQL user to be retrieved.

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get a MySQL user.
```

## `mw database mysql user list`

List MySQL users belonging to a database.

```
USAGE
  $ mw database mysql user list -o txt|json|yaml|csv|tsv --database-id <value> [-x] [--no-header] [--no-truncate]
    [--no-relative-dates] [--csv-separator ,|;]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -x, --extended                show extended information
      --csv-separator=<option>  [default: ,] separator for CSV output (only relevant for CSV output)
                                <options: ,|;>
      --database-id=<value>     (required) ID of the MySQL database to list users for.
      --no-header               hide table header
      --no-relative-dates       show dates in absolute format, not relative (only relevant for txt output)
      --no-truncate             do not truncate output (only relevant for txt output)

DESCRIPTION
  List MySQL users belonging to a database.
```

## `mw database mysql user update USER-ID`

Update an existing MySQL user

```
USAGE
  $ mw database mysql user update USER-ID [-q] [--access-level readonly|full] [--description <value>] [--password <value>]
    [--access-ip-mask <value>] [--enable-external-access | --disable-external-access]

ARGUMENTS
  USER-ID  ID of the MySQL user to update.

FLAGS
  -q, --quiet                    suppress process output and only display a machine-readable summary.
      --access-ip-mask=<value>   IP to restrict external access to.
      --access-level=<option>    Set the access level permissions for the SFTP user.
                                 <options: readonly|full>
      --description=<value>      Set the description for the MySQL user.
      --disable-external-access  Disable external access.
      --enable-external-access   Enable external access.
      --password=<value>         Password used for authentication

DESCRIPTION
  Update an existing MySQL user

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --access-ip-mask=<value>  IP to restrict external access to.

    If specified as IPv4, external access will be restricted to only the specified IP addresses when external access is
    enabled.

  --access-level=readonly|full  Set the access level permissions for the SFTP user.

    Must be specified as either readonly or full. Grant the user either read-only or full file read and write access to
    files.

  --description=<value>  Set the description for the MySQL user.

    Set the description for the specified MySQL user to be displayed in mStudio and with the list command.

  --disable-external-access  Disable external access.

    Set external access for this MySQL user to disabled. External access will not be possible for this user.

  --enable-external-access  Enable external access.

    Set external access for this MySQL user to enabled. External access by this user will be possible. External access
    can be restricted to certain IP addresses using the 'access-ip-mask' flag.

  --password=<value>  Password used for authentication

    Specify a password to use for authentication when connecting to the database with this user.
```

## `mw database mysql versions`

List available MySQL versions.

```
USAGE
  $ mw database mysql versions -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List available MySQL versions.
```

## `mw database redis create`

Create a new Redis database

```
USAGE
  $ mw database redis create -d <value> --version <value> [-p <value>] [-q] [--persistent] [--max-memory <value>]
    [--max-memory-policy
    noeviction|allkeys-lru|allkeys-lfu|volatile-lru|volatile-lfu|allkeys-random|volatile-random|volatile-ttl]

FLAGS
  -d, --description=<value>         (required) a description for the database
  -p, --project-id=<value>          ID or short ID of a project; this flag is optional if a default project is set in
                                    the context
  -q, --quiet                       suppress process output and only display a machine-readable summary.
      --max-memory=<value>          the maximum memory for the Redis database
      --max-memory-policy=<option>  the Redis eviction policy
                                    <options: noeviction|allkeys-lru|allkeys-lfu|volatile-lru|volatile-lfu|allkeys-rando
                                    m|volatile-random|volatile-ttl>
      --[no-]persistent             enable persistent storage for the Redis database
      --version=<value>             (required) the Redis version to use

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --max-memory=<value>  the maximum memory for the Redis database

    This specifies the maximum memory; you should provide a number, followed by one of the IEC suffixes, like "Ki", "Mi"
    or "Gi"

  --max-memory-policy=noeviction|allkeys-lru|allkeys-lfu|volatile-lru|volatile-lfu|allkeys-random|volatile-random|volatile-ttl

    the Redis eviction policy

    See https://redis.io/docs/reference/eviction/#eviction-policies for details

  --version=<value>  the Redis version to use

    Use the "database redis versions" command to list available versions
```

## `mw database redis get ID`

Get a Redis database.

```
USAGE
  $ mw database redis get ID -o txt|json|yaml

ARGUMENTS
  ID  ID of the Redis database to retrieve.

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get a Redis database.
```

## `mw database redis list`

List Redis databases belonging to a project.

```
USAGE
  $ mw database redis list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List Redis databases belonging to a project.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw database redis shell DATABASE-ID`

Connect to a Redis database via the redis-cli

```
USAGE
  $ mw database redis shell DATABASE-ID [-q] [--ssh-user <value>] [--ssh-identity-file <value>]

ARGUMENTS
  DATABASE-ID  The ID of the database (when a project context is set, you can also use the name)

FLAGS
  -q, --quiet  suppress process output and only display a machine-readable summary.

SSH CONNECTION FLAGS
  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.
  --ssh-user=<value>           override the SSH user to connect with; if omitted, your own user will be used

DESCRIPTION
  Connect to a Redis database via the redis-cli

  This command opens an interactive redis-cli shell to a Redis database.

  This command relies on connecting to your hosting environment via SSH. For this, it will use your systems SSH client
  under the hood, and will respect your SSH configuration in ~/.ssh/config.

  An exception to this is the 'User' configuration, which will be overridden by this command to either your
  authenticated mStudio user or the user specified with the --ssh-user flag.

  See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.

    The SSH identity file to use for the connection. This file should contain an SSH private key and will be used to
    authenticate the connection to the server.

    You can also set this value by setting the MITTWALD_SSH_IDENTITY_FILE environment variable.

  --ssh-user=<value>  override the SSH user to connect with; if omitted, your own user will be used

    This flag can be used to override the SSH user that is used for a connection; be default, your own personal user
    will be used for this.

    You can also set this value by setting the MITTWALD_SSH_USER environment variable.
```

## `mw database redis versions`

List available Redis versions.

```
USAGE
  $ mw database redis versions -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List available Redis versions.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```
