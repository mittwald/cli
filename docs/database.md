`mw database`
=============

Manage databases (like MySQL and Redis) in your projects

* [`mw database mysql phpmyadmin DATABASE-ID`](#mw-database-mysql-phpmyadmin-database-id)

## `mw database mysql phpmyadmin DATABASE-ID`

Open phpMyAdmin for a MySQL database.

```
USAGE
  $ mw database mysql phpmyadmin DATABASE-ID [--token <value>]

ARGUMENTS
  DATABASE-ID  The ID or name of the database

AUTHENTICATION FLAGS
  --token=<value>  API token to use for authentication (overrides environment and config file). NOTE: watch out that
                   tokens passed via this flag might be logged in your shell history.
```
