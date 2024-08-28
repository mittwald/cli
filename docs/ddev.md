`mw ddev`
=========

Integrate your mittwald projects with DDEV

* [`mw ddev init [INSTALLATION-ID]`](#mw-ddev-init-installation-id)
* [`mw ddev render-config [INSTALLATION-ID]`](#mw-ddev-render-config-installation-id)

## `mw ddev init [INSTALLATION-ID]`

Initialize a new ddev project in the current directory.

```
USAGE
  $ mw ddev init [INSTALLATION-ID] [-q] [--override-type
    backdrop|craftcms|django4|drupal6|drupal7|drupal|laravel|magento|magento2|php|python|shopware6|silverstripe|typo3|wo
    rdpress|auto] [--without-database | --database-id <value>] [--project-name <value>] [--override-mittwald-plugin
    <value>]

ARGUMENTS
  INSTALLATION-ID  ID or short ID of an app installation; this argument is optional if a default app installation is set
                   in the context.

FLAGS
  -q, --quiet                   suppress process output and only display a machine-readable summary.
      --database-id=<value>     ID of the application database
      --override-type=<option>  [default: auto] Override the type of the generated DDEV configuration
                                <options: backdrop|craftcms|django4|drupal6|drupal7|drupal|laravel|magento|magento2|php|
                                python|shopware6|silverstripe|typo3|wordpress|auto>
      --project-name=<value>    DDEV project name
      --without-database        Create a DDEV project without a database

DEVELOPMENT FLAGS
  --override-mittwald-plugin=<value>  [default: mittwald/ddev] override the mittwald plugin

DESCRIPTION
  Initialize a new ddev project in the current directory.

  This command initializes a new ddev configuration for an existing app installation in the current directory.

  More precisely, this command will do the following:

  1. Create a new ddev configuration file in the .ddev directory, appropriate for the reference app installation
  2. Initialize a new ddev project with the given configuration
  3. Install the official mittwald DDEV addon
  4. Add SSH credentials to the DDEV project

  This command can be run repeatedly to update the DDEV configuration of the project.

  Please note that this command requires DDEV to be installed on your system.

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --database-id=<value>  ID of the application database

    The ID of the database to use for the DDEV project; if set to 'auto', the command will use the database linked to
    the app installation.

    Setting a database ID (either automatically or manually) is required. To create a DDEV project without a database,
    set the --without-database flag.

  --override-mittwald-plugin=<value>  override the mittwald plugin

    This flag allows you to override the mittwald plugin that should be installed by default; this is useful for testing
    purposes

  --override-type=backdrop|craftcms|django4|drupal6|drupal7|drupal|laravel|magento|magento2|php|python|shopware6|silverstripe|typo3|wordpress|auto

    Override the type of the generated DDEV configuration

    The type of the generated DDEV configuration; this can be any of the documented DDEV project types, or 'auto' (which
    is also the default) for automatic discovery.

    See https://ddev.readthedocs.io/en/latest/users/configuration/config/#type for more information

  --project-name=<value>  DDEV project name

    The name of the DDEV project

  --without-database  Create a DDEV project without a database

    Use this flag to create a DDEV project without a database; this is useful for projects that do not require a
    database.
```

## `mw ddev render-config [INSTALLATION-ID]`

Generate a DDEV configuration YAML file for the current app.

```
USAGE
  $ mw ddev render-config [INSTALLATION-ID] [--override-type
    backdrop|craftcms|django4|drupal6|drupal7|drupal|laravel|magento|magento2|php|python|shopware6|silverstripe|typo3|wo
    rdpress|auto] [--without-database | --database-id <value>]

ARGUMENTS
  INSTALLATION-ID  ID or short ID of an app installation; this argument is optional if a default app installation is set
                   in the context.

FLAGS
  --database-id=<value>     ID of the application database
  --override-type=<option>  [default: auto] Override the type of the generated DDEV configuration
                            <options: backdrop|craftcms|django4|drupal6|drupal7|drupal|laravel|magento|magento2|php|pyth
                            on|shopware6|silverstripe|typo3|wordpress|auto>
  --without-database        Create a DDEV project without a database

DESCRIPTION
  Generate a DDEV configuration YAML file for the current app.

  This command initializes a new ddev configuration in the current directory.

FLAG DESCRIPTIONS
  --database-id=<value>  ID of the application database

    The ID of the database to use for the DDEV project; if set to 'auto', the command will use the database linked to
    the app installation.

    Setting a database ID (either automatically or manually) is required. To create a DDEV project without a database,
    set the --without-database flag.

  --override-type=backdrop|craftcms|django4|drupal6|drupal7|drupal|laravel|magento|magento2|php|python|shopware6|silverstripe|typo3|wordpress|auto

    Override the type of the generated DDEV configuration

    The type of the generated DDEV configuration; this can be any of the documented DDEV project types, or 'auto' (which
    is also the default) for automatic discovery.

    See https://ddev.readthedocs.io/en/latest/users/configuration/config/#type for more information

  --without-database  Create a DDEV project without a database

    Use this flag to create a DDEV project without a database; this is useful for projects that do not require a
    database.
```
