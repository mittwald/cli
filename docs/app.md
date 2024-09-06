`mw app`
========

Manage apps, and app installations in your projects

* [`mw app copy [INSTALLATION-ID]`](#mw-app-copy-installation-id)
* [`mw app create node`](#mw-app-create-node)
* [`mw app create php`](#mw-app-create-php)
* [`mw app create python`](#mw-app-create-python)
* [`mw app create static`](#mw-app-create-static)
* [`mw app dependency list`](#mw-app-dependency-list)
* [`mw app dependency update [INSTALLATION-ID]`](#mw-app-dependency-update-installation-id)
* [`mw app dependency versions SYSTEMSOFTWARE`](#mw-app-dependency-versions-systemsoftware)
* [`mw app download [INSTALLATION-ID]`](#mw-app-download-installation-id)
* [`mw app get [INSTALLATION-ID]`](#mw-app-get-installation-id)
* [`mw app install contao`](#mw-app-install-contao)
* [`mw app install drupal`](#mw-app-install-drupal)
* [`mw app install grav`](#mw-app-install-grav)
* [`mw app install humhub`](#mw-app-install-humhub)
* [`mw app install joomla`](#mw-app-install-joomla)
* [`mw app install magento2`](#mw-app-install-magento2)
* [`mw app install matomo`](#mw-app-install-matomo)
* [`mw app install moodle`](#mw-app-install-moodle)
* [`mw app install neos`](#mw-app-install-neos)
* [`mw app install nextcloud`](#mw-app-install-nextcloud)
* [`mw app install prestashop`](#mw-app-install-prestashop)
* [`mw app install shopware5`](#mw-app-install-shopware5)
* [`mw app install shopware6`](#mw-app-install-shopware6)
* [`mw app install typo3`](#mw-app-install-typo3)
* [`mw app install wordpress`](#mw-app-install-wordpress)
* [`mw app list`](#mw-app-list)
* [`mw app list-upgrade-candidates [INSTALLATION-ID]`](#mw-app-list-upgrade-candidates-installation-id)
* [`mw app ssh [INSTALLATION-ID]`](#mw-app-ssh-installation-id)
* [`mw app uninstall [INSTALLATION-ID]`](#mw-app-uninstall-installation-id)
* [`mw app update [INSTALLATION-ID]`](#mw-app-update-installation-id)
* [`mw app upgrade [INSTALLATION-ID]`](#mw-app-upgrade-installation-id)
* [`mw app upload [INSTALLATION-ID]`](#mw-app-upload-installation-id)
* [`mw app versions [APP]`](#mw-app-versions-app)

## `mw app copy [INSTALLATION-ID]`

Copy an app within a project

```
USAGE
  $ mw app copy [INSTALLATION-ID] --description <value> [-q]

ARGUMENTS
  INSTALLATION-ID  ID or short ID of an app installation; this argument is optional if a default app installation is set
                   in the context.

FLAGS
  -q, --quiet                suppress process output and only display a machine-readable summary.
      --description=<value>  (required) set a description for the new app installation

DESCRIPTION
  Copy an app within a project

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw app create node`

Creates new custom Node.js installation.

```
USAGE
  $ mw app create node [-p <value>] [-q] [--site-title <value>] [--entrypoint <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>    ID or short ID of a project; this flag is optional if a default project is set in the
                              context
  -q, --quiet                 suppress process output and only display a machine-readable summary.
  -w, --wait                  wait for the resource to be ready.
      --entrypoint=<value>    [default: yarn start] the command that should be used to start your custom Node.js
                              application.
      --site-title=<value>    site title for your custom Node.js installation.
      --wait-timeout=<value>  [default: 600s] the duration to wait for the resource to be ready (common units like 'ms',
                              's', 'm' are accepted).

DESCRIPTION
  Creates new custom Node.js installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --entrypoint=<value>  the command that should be used to start your custom Node.js application.

    This is the command that should be used to start your application; the app is required to run in the foreground, and
    to listen on the port specified by the PORT environment variable.

  --site-title=<value>  site title for your custom Node.js installation.

    The site title for this custom Node.js installation. It is also the title shown in the app overview in the mStudio
    and the CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished
```

## `mw app create php`

Creates new custom PHP installation.

```
USAGE
  $ mw app create php --document-root <value> [-p <value>] [-q] [--site-title <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>     ID or short ID of a project; this flag is optional if a default project is set in the
                               context
  -q, --quiet                  suppress process output and only display a machine-readable summary.
  -w, --wait                   wait for the resource to be ready.
      --document-root=<value>  (required) [default: /] the document root from which your custom PHP will be served
                               (relative to the installation path)
      --site-title=<value>     site title for your custom PHP installation.
      --wait-timeout=<value>   [default: 600s] the duration to wait for the resource to be ready (common units like
                               'ms', 's', 'm' are accepted).

DESCRIPTION
  Creates new custom PHP installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --document-root=<value>

    the document root from which your custom PHP will be served (relative to the installation path)

    This is the document root from which the files of your application will be served by the web server. This directory
    is specified relative to the installation path.

  --site-title=<value>  site title for your custom PHP installation.

    The site title for this custom PHP installation. It is also the title shown in the app overview in the mStudio and
    the CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished
```

## `mw app create python`

Creates new custom python site installation.

```
USAGE
  $ mw app create python [-p <value>] [-q] [--site-title <value>] [--entrypoint <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>    ID or short ID of a project; this flag is optional if a default project is set in the
                              context
  -q, --quiet                 suppress process output and only display a machine-readable summary.
  -w, --wait                  wait for the resource to be ready.
      --entrypoint=<value>    the command that should be used to start your custom python site application.
      --site-title=<value>    site title for your custom python site installation.
      --wait-timeout=<value>  [default: 600s] the duration to wait for the resource to be ready (common units like 'ms',
                              's', 'm' are accepted).

DESCRIPTION
  Creates new custom python site installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --entrypoint=<value>  the command that should be used to start your custom python site application.

    This is the command that should be used to start your application; the app is required to run in the foreground, and
    to listen on the port specified by the PORT environment variable.

  --site-title=<value>  site title for your custom python site installation.

    The site title for this custom python site installation. It is also the title shown in the app overview in the
    mStudio and the CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished
```

## `mw app create static`

Creates new custom static site installation.

```
USAGE
  $ mw app create static --document-root <value> [-p <value>] [-q] [--site-title <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>     ID or short ID of a project; this flag is optional if a default project is set in the
                               context
  -q, --quiet                  suppress process output and only display a machine-readable summary.
  -w, --wait                   wait for the resource to be ready.
      --document-root=<value>  (required) [default: /] the document root from which your custom static site will be
                               served (relative to the installation path)
      --site-title=<value>     site title for your custom static site installation.
      --wait-timeout=<value>   [default: 600s] the duration to wait for the resource to be ready (common units like
                               'ms', 's', 'm' are accepted).

DESCRIPTION
  Creates new custom static site installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --document-root=<value>

    the document root from which your custom static site will be served (relative to the installation path)

    This is the document root from which the files of your application will be served by the web server. This directory
    is specified relative to the installation path.

  --site-title=<value>  site title for your custom static site installation.

    The site title for this custom static site installation. It is also the title shown in the app overview in the
    mStudio and the CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished
```

## `mw app dependency list`

Get all available dependencies

```
USAGE
  $ mw app dependency list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  Get all available dependencies
```

## `mw app dependency update [INSTALLATION-ID]`

Update the dependencies of an app

```
USAGE
  $ mw app dependency update [INSTALLATION-ID] --set <value>... [-q] [--update-policy
  none|inheritedFromApp|patchLevel|all]

ARGUMENTS
  INSTALLATION-ID  ID or short ID of an app installation; this argument is optional if a default app installation is set
                   in the context.

FLAGS
  -q, --quiet                   suppress process output and only display a machine-readable summary.
      --set=<value>...          (required) set a dependency to a specific version
      --update-policy=<option>  [default: patchLevel] set the update policy for the configured dependencies
                                <options: none|inheritedFromApp|patchLevel|all>

EXAMPLES
  Update Node.js version to newest available from the 18.x branch

    $ mw app dependency update $APP_ID --set node=~18

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --set=<value>...  set a dependency to a specific version

    The format is <dependency>=<version>, where <dependency> is the name of the dependency (use the "mw app dependency
    list" command to get a list of available dependencies) and <version> is a semver constraint.

    This flag may be specified multiple times to update multiple dependencies.
```

## `mw app dependency versions SYSTEMSOFTWARE`

Get all available versions of a particular dependency

```
USAGE
  $ mw app dependency versions SYSTEMSOFTWARE -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate]
    [--no-relative-dates] [--csv-separator ,|;]

ARGUMENTS
  SYSTEMSOFTWARE  name of the systemsoftware for which to list versions

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
  Get all available versions of a particular dependency
```

## `mw app download [INSTALLATION-ID]`

Download the filesystem of an app within a project to your local machine

```
USAGE
  $ mw app download [INSTALLATION-ID] --target <value> [-q] [--ssh-user <value>] [--ssh-identity-file <value>]
    [--exclude <value>...] [--dry-run] [--delete]

ARGUMENTS
  INSTALLATION-ID  ID or short ID of an app installation; this argument is optional if a default app installation is set
                   in the context.

FLAGS
  -q, --quiet               suppress process output and only display a machine-readable summary.
      --delete              delete local files that are not present on the server
      --dry-run             do not actually download the app installation
      --exclude=<value>...  [default: ] exclude files matching the given pattern
      --target=<value>      (required) target directory to download the app installation to

SSH CONNECTION FLAGS
  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.
  --ssh-user=<value>           override the SSH user to connect with; if omitted, your own user will be used

DESCRIPTION
  Download the filesystem of an app within a project to your local machine

  This command downloads the filesystem of an app installation to your local machine via rsync.

  For this, rsync needs to be installed on your system.

  This command relies on connecting to your hosting environment via SSH. For this, it will use your systems SSH client
  under the hood, and will respect your SSH configuration in ~/.ssh/config.

  An exception to this is the 'User' configuration, which will be overridden by this command to either your
  authenticated mStudio user or the user specified with the --ssh-user flag.

  See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.

  This command will also look for a file named .mw-rsync-filter in the current directory and use it as a filter file for
  rsync. Have a look at https://manpages.ubuntu.com/manpages/noble/en/man1/rsync.1.html#filter%20rules for more
  information on how to write filter rules.

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

## `mw app get [INSTALLATION-ID]`

Get details about an app installation

```
USAGE
  $ mw app get [INSTALLATION-ID] -o txt|json|yaml

ARGUMENTS
  INSTALLATION-ID  ID or short ID of an app installation; this argument is optional if a default app installation is set
                   in the context.

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get details about an app installation
```

## `mw app install contao`

Creates new Contao installation.

```
USAGE
  $ mw app install contao --version <value> [-p <value>] [-q] [--host <value>] [--admin-firstname <value>] [--admin-user
    <value>] [--admin-email <value>] [--admin-pass <value>] [--admin-lastname <value>] [--site-title <value>] [-w]
    [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>       ID or short ID of a project; this flag is optional if a default project is set in the
                                 context
  -q, --quiet                    suppress process output and only display a machine-readable summary.
  -w, --wait                     wait for the resource to be ready.
      --admin-email=<value>      email address of your administrator user.
      --admin-firstname=<value>  first name of your administrator user.
      --admin-lastname=<value>   Lastname of your administrator user.
      --admin-pass=<value>       password of your administrator user.
      --admin-user=<value>       Username for your administrator user.
      --host=<value>             host to initially configure your Contao installation with; needs to be created
                                 separately.
      --site-title=<value>       site title for your Contao installation.
      --version=<value>          (required) [default: latest] version of Contao to be installed.
      --wait-timeout=<value>     [default: 600s] the duration to wait for the resource to be ready (common units like
                                 'ms', 's', 'm' are accepted).

DESCRIPTION
  Creates new Contao installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the Contao installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-firstname=<value>  first name of your administrator user.

    The first name that will be used for the first administrator user that is created during the Contao installation.
    If unspecified, the first name of your mStudio user will be used. This value can be changed after the installation
    is finished.

  --admin-lastname=<value>  Lastname of your administrator user.

    The last name that will be used for the first administrator user that is created during the Contao installation.
    If unspecified, the last name of your mStudio user will be used. This value can be changed after the installation is
    finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the Contao installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the Contao installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --host=<value>  host to initially configure your Contao installation with; needs to be created separately.

    Specify a host which will be used during the installation and as an initial host for the Contao configuration.
    If unspecified, the default host for the given project will be used.
    This does not change the target of the used host and can be changed later by configuring the host and your Contao
    installation.

  --site-title=<value>  site title for your Contao installation.

    The site title for this Contao installation. It is also the title shown in the app overview in the mStudio and the
    CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of Contao to be installed.

    Specify the version in which your Contao will be installed.
    If unspecified, the Contao will be installed in the latest available version.
```

## `mw app install drupal`

Creates new Drupal installation.

```
USAGE
  $ mw app install drupal --version <value> [-p <value>] [-q] [--host <value>] [--admin-user <value>] [--admin-email
    <value>] [--admin-pass <value>] [--site-title <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>    ID or short ID of a project; this flag is optional if a default project is set in the
                              context
  -q, --quiet                 suppress process output and only display a machine-readable summary.
  -w, --wait                  wait for the resource to be ready.
      --admin-email=<value>   email address of your administrator user.
      --admin-pass=<value>    password of your administrator user.
      --admin-user=<value>    Username for your administrator user.
      --host=<value>          host to initially configure your Drupal installation with; needs to be created separately.
      --site-title=<value>    site title for your Drupal installation.
      --version=<value>       (required) [default: latest] version of Drupal to be installed.
      --wait-timeout=<value>  [default: 600s] the duration to wait for the resource to be ready (common units like 'ms',
                              's', 'm' are accepted).

DESCRIPTION
  Creates new Drupal installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the Drupal installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the Drupal installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the Drupal installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --host=<value>  host to initially configure your Drupal installation with; needs to be created separately.

    Specify a host which will be used during the installation and as an initial host for the Drupal configuration.
    If unspecified, the default host for the given project will be used.
    This does not change the target of the used host and can be changed later by configuring the host and your Drupal
    installation.

  --site-title=<value>  site title for your Drupal installation.

    The site title for this Drupal installation. It is also the title shown in the app overview in the mStudio and the
    CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of Drupal to be installed.

    Specify the version in which your Drupal will be installed.
    If unspecified, the Drupal will be installed in the latest available version.
```

## `mw app install grav`

Creates new Grav installation.

```
USAGE
  $ mw app install grav --version <value> [-p <value>] [-q] [--admin-user <value>] [--admin-email <value>]
    [--admin-pass <value>] [--admin-firstname <value>] [--admin-lastname <value>] [--site-title <value>] [-w]
    [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>       ID or short ID of a project; this flag is optional if a default project is set in the
                                 context
  -q, --quiet                    suppress process output and only display a machine-readable summary.
  -w, --wait                     wait for the resource to be ready.
      --admin-email=<value>      email address of your administrator user.
      --admin-firstname=<value>  first name of your administrator user.
      --admin-lastname=<value>   Lastname of your administrator user.
      --admin-pass=<value>       password of your administrator user.
      --admin-user=<value>       Username for your administrator user.
      --site-title=<value>       site title for your Grav installation.
      --version=<value>          (required) [default: latest] version of Grav to be installed.
      --wait-timeout=<value>     [default: 600s] the duration to wait for the resource to be ready (common units like
                                 'ms', 's', 'm' are accepted).

DESCRIPTION
  Creates new Grav installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the Grav installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-firstname=<value>  first name of your administrator user.

    The first name that will be used for the first administrator user that is created during the Grav installation.
    If unspecified, the first name of your mStudio user will be used. This value can be changed after the installation
    is finished.

  --admin-lastname=<value>  Lastname of your administrator user.

    The last name that will be used for the first administrator user that is created during the Grav installation.
    If unspecified, the last name of your mStudio user will be used. This value can be changed after the installation is
    finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the Grav installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the Grav installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --site-title=<value>  site title for your Grav installation.

    The site title for this Grav installation. It is also the title shown in the app overview in the mStudio and the
    CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of Grav to be installed.

    Specify the version in which your Grav will be installed.
    If unspecified, the Grav will be installed in the latest available version.
```

## `mw app install humhub`

Creates new HumHub installation.

```
USAGE
  $ mw app install humhub --version <value> [-p <value>] [-q] [--host <value>] [--admin-user <value>] [--admin-email
    <value>] [--admin-pass <value>] [--admin-firstname <value>] [--admin-lastname <value>] [--site-title <value>] [-w]
    [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>       ID or short ID of a project; this flag is optional if a default project is set in the
                                 context
  -q, --quiet                    suppress process output and only display a machine-readable summary.
  -w, --wait                     wait for the resource to be ready.
      --admin-email=<value>      email address of your administrator user.
      --admin-firstname=<value>  first name of your administrator user.
      --admin-lastname=<value>   Lastname of your administrator user.
      --admin-pass=<value>       password of your administrator user.
      --admin-user=<value>       Username for your administrator user.
      --host=<value>             host to initially configure your HumHub installation with; needs to be created
                                 separately.
      --site-title=<value>       site title for your HumHub installation.
      --version=<value>          (required) [default: latest] version of HumHub to be installed.
      --wait-timeout=<value>     [default: 600s] the duration to wait for the resource to be ready (common units like
                                 'ms', 's', 'm' are accepted).

DESCRIPTION
  Creates new HumHub installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the HumHub installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-firstname=<value>  first name of your administrator user.

    The first name that will be used for the first administrator user that is created during the HumHub installation.
    If unspecified, the first name of your mStudio user will be used. This value can be changed after the installation
    is finished.

  --admin-lastname=<value>  Lastname of your administrator user.

    The last name that will be used for the first administrator user that is created during the HumHub installation.
    If unspecified, the last name of your mStudio user will be used. This value can be changed after the installation is
    finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the HumHub installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the HumHub installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --host=<value>  host to initially configure your HumHub installation with; needs to be created separately.

    Specify a host which will be used during the installation and as an initial host for the HumHub configuration.
    If unspecified, the default host for the given project will be used.
    This does not change the target of the used host and can be changed later by configuring the host and your HumHub
    installation.

  --site-title=<value>  site title for your HumHub installation.

    The site title for this HumHub installation. It is also the title shown in the app overview in the mStudio and the
    CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of HumHub to be installed.

    Specify the version in which your HumHub will be installed.
    If unspecified, the HumHub will be installed in the latest available version.
```

## `mw app install joomla`

Creates new Joomla! installation.

```
USAGE
  $ mw app install joomla --version <value> [-p <value>] [-q] [--host <value>] [--admin-user <value>] [--admin-email
    <value>] [--admin-pass <value>] [--admin-firstname <value>] [--admin-lastname <value>] [--site-title <value>] [-w]
    [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>       ID or short ID of a project; this flag is optional if a default project is set in the
                                 context
  -q, --quiet                    suppress process output and only display a machine-readable summary.
  -w, --wait                     wait for the resource to be ready.
      --admin-email=<value>      email address of your administrator user.
      --admin-firstname=<value>  first name of your administrator user.
      --admin-lastname=<value>   Lastname of your administrator user.
      --admin-pass=<value>       password of your administrator user.
      --admin-user=<value>       Username for your administrator user.
      --host=<value>             host to initially configure your Joomla! installation with; needs to be created
                                 separately.
      --site-title=<value>       site title for your Joomla! installation.
      --version=<value>          (required) [default: latest] version of Joomla! to be installed.
      --wait-timeout=<value>     [default: 600s] the duration to wait for the resource to be ready (common units like
                                 'ms', 's', 'm' are accepted).

DESCRIPTION
  Creates new Joomla! installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the Joomla! installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-firstname=<value>  first name of your administrator user.

    The first name that will be used for the first administrator user that is created during the Joomla! installation.
    If unspecified, the first name of your mStudio user will be used. This value can be changed after the installation
    is finished.

  --admin-lastname=<value>  Lastname of your administrator user.

    The last name that will be used for the first administrator user that is created during the Joomla! installation.
    If unspecified, the last name of your mStudio user will be used. This value can be changed after the installation is
    finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the Joomla! installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the Joomla! installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --host=<value>  host to initially configure your Joomla! installation with; needs to be created separately.

    Specify a host which will be used during the installation and as an initial host for the Joomla! configuration.
    If unspecified, the default host for the given project will be used.
    This does not change the target of the used host and can be changed later by configuring the host and your Joomla!
    installation.

  --site-title=<value>  site title for your Joomla! installation.

    The site title for this Joomla! installation. It is also the title shown in the app overview in the mStudio and the
    CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of Joomla! to be installed.

    Specify the version in which your Joomla! will be installed.
    If unspecified, the Joomla! will be installed in the latest available version.
```

## `mw app install magento2`

Creates new Magento 2 installation.

```
USAGE
  $ mw app install magento2 --version <value> --opensearch-host <value> --opensearch-port <value> [-p <value>] [-q]
    [--host <value>] [--admin-user <value>] [--admin-email <value>] [--admin-pass <value>] [--admin-firstname <value>]
    [--admin-lastname <value>] [--site-title <value>] [--shop-email <value>] [--shop-lang <value>] [--shop-currency
    <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>       ID or short ID of a project; this flag is optional if a default project is set in the
                                 context
  -q, --quiet                    suppress process output and only display a machine-readable summary.
  -w, --wait                     wait for the resource to be ready.
      --admin-email=<value>      email address of your administrator user.
      --admin-firstname=<value>  first name of your administrator user.
      --admin-lastname=<value>   Lastname of your administrator user.
      --admin-pass=<value>       password of your administrator user.
      --admin-user=<value>       Username for your administrator user.
      --host=<value>             host to initially configure your Magento 2 installation with; needs to be created
                                 separately.
      --opensearch-host=<value>  (required) the OpenSearch instance host which your Magento 2 will try to connect to
      --opensearch-port=<value>  (required) the OpenSearch instance port which your Magento 2 will try to connect to
      --shop-currency=<value>    Currency your Magento 2 will be working with.
      --shop-email=<value>       email address your Magento 2 will be working with.
      --shop-lang=<value>        language your Magento 2 will be working with.
      --site-title=<value>       site title for your Magento 2 installation.
      --version=<value>          (required) [default: latest] version of Magento 2 to be installed.
      --wait-timeout=<value>     [default: 600s] the duration to wait for the resource to be ready (common units like
                                 'ms', 's', 'm' are accepted).

DESCRIPTION
  Creates new Magento 2 installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the Magento 2 installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-firstname=<value>  first name of your administrator user.

    The first name that will be used for the first administrator user that is created during the Magento 2 installation.
    If unspecified, the first name of your mStudio user will be used. This value can be changed after the installation
    is finished.

  --admin-lastname=<value>  Lastname of your administrator user.

    The last name that will be used for the first administrator user that is created during the Magento 2 installation.
    If unspecified, the last name of your mStudio user will be used. This value can be changed after the installation is
    finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the Magento 2 installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the Magento 2 installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --host=<value>  host to initially configure your Magento 2 installation with; needs to be created separately.

    Specify a host which will be used during the installation and as an initial host for the Magento 2 configuration.
    If unspecified, the default host for the given project will be used.
    This does not change the target of the used host and can be changed later by configuring the host and your Magento 2
    installation.

  --opensearch-host=<value>  the OpenSearch instance host which your Magento 2 will try to connect to

    This is the host of an existing OpenSearch instance which your application will have to connect to during
    installation.This has to be a valid connection otherwise the installation will fail.

  --opensearch-port=<value>  the OpenSearch instance port which your Magento 2 will try to connect to

    This is the port of an existing OpenSearch instance which your application will have to connect to during
    installation.This has to be a valid connection otherwise the installation will fail.

  --shop-currency=<value>  Currency your Magento 2 will be working with.

    The default currency your Magento 2 shop communicates prices and calculates transactions with.
    If unspecified, this will default to EUR(€). The currency can be changed after the installation is finished.

  --shop-email=<value>  email address your Magento 2 will be working with.

    The email address your Magento 2 installation will be using for correspondence with end users.
    If unspecified, your mStudio account email will be used. This email address can be changed after the installation is
    finished.

  --shop-lang=<value>  language your Magento 2 will be working with.

    The default language your Magento 2 installation will be using. The front- and back end will be displayed using the
    given language.
    If unspecified, this will default to German (de_DE). The language can be changed after the installation is finished.

  --site-title=<value>  site title for your Magento 2 installation.

    The site title for this Magento 2 installation. It is also the title shown in the app overview in the mStudio and
    the CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of Magento 2 to be installed.

    Specify the version in which your Magento 2 will be installed.
    If unspecified, the Magento 2 will be installed in the latest available version.
```

## `mw app install matomo`

Creates new Matomo installation.

```
USAGE
  $ mw app install matomo --version <value> [-p <value>] [-q] [--host <value>] [--admin-user <value>] [--admin-email
    <value>] [--admin-pass <value>] [--site-title <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>    ID or short ID of a project; this flag is optional if a default project is set in the
                              context
  -q, --quiet                 suppress process output and only display a machine-readable summary.
  -w, --wait                  wait for the resource to be ready.
      --admin-email=<value>   email address of your administrator user.
      --admin-pass=<value>    password of your administrator user.
      --admin-user=<value>    Username for your administrator user.
      --host=<value>          host to initially configure your Matomo installation with; needs to be created separately.
      --site-title=<value>    site title for your Matomo installation.
      --version=<value>       (required) [default: latest] version of Matomo to be installed.
      --wait-timeout=<value>  [default: 600s] the duration to wait for the resource to be ready (common units like 'ms',
                              's', 'm' are accepted).

DESCRIPTION
  Creates new Matomo installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the Matomo installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the Matomo installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the Matomo installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --host=<value>  host to initially configure your Matomo installation with; needs to be created separately.

    Specify a host which will be used during the installation and as an initial host for the Matomo configuration.
    If unspecified, the default host for the given project will be used.
    This does not change the target of the used host and can be changed later by configuring the host and your Matomo
    installation.

  --site-title=<value>  site title for your Matomo installation.

    The site title for this Matomo installation. It is also the title shown in the app overview in the mStudio and the
    CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of Matomo to be installed.

    Specify the version in which your Matomo will be installed.
    If unspecified, the Matomo will be installed in the latest available version.
```

## `mw app install moodle`

Creates new Moodle installation.

```
USAGE
  $ mw app install moodle --version <value> [-p <value>] [-q] [--host <value>] [--admin-user <value>] [--admin-email
    <value>] [--admin-pass <value>] [--site-title <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>    ID or short ID of a project; this flag is optional if a default project is set in the
                              context
  -q, --quiet                 suppress process output and only display a machine-readable summary.
  -w, --wait                  wait for the resource to be ready.
      --admin-email=<value>   email address of your administrator user.
      --admin-pass=<value>    password of your administrator user.
      --admin-user=<value>    Username for your administrator user.
      --host=<value>          host to initially configure your Moodle installation with; needs to be created separately.
      --site-title=<value>    site title for your Moodle installation.
      --version=<value>       (required) [default: latest] version of Moodle to be installed.
      --wait-timeout=<value>  [default: 600s] the duration to wait for the resource to be ready (common units like 'ms',
                              's', 'm' are accepted).

DESCRIPTION
  Creates new Moodle installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the Moodle installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the Moodle installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the Moodle installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --host=<value>  host to initially configure your Moodle installation with; needs to be created separately.

    Specify a host which will be used during the installation and as an initial host for the Moodle configuration.
    If unspecified, the default host for the given project will be used.
    This does not change the target of the used host and can be changed later by configuring the host and your Moodle
    installation.

  --site-title=<value>  site title for your Moodle installation.

    The site title for this Moodle installation. It is also the title shown in the app overview in the mStudio and the
    CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of Moodle to be installed.

    Specify the version in which your Moodle will be installed.
    If unspecified, the Moodle will be installed in the latest available version.
```

## `mw app install neos`

Creates new NEOS installation.

```
USAGE
  $ mw app install neos --version <value> [-p <value>] [-q] [--admin-user <value>] [--admin-pass <value>]
    [--admin-firstname <value>] [--admin-lastname <value>] [--site-title <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>       ID or short ID of a project; this flag is optional if a default project is set in the
                                 context
  -q, --quiet                    suppress process output and only display a machine-readable summary.
  -w, --wait                     wait for the resource to be ready.
      --admin-firstname=<value>  first name of your administrator user.
      --admin-lastname=<value>   Lastname of your administrator user.
      --admin-pass=<value>       password of your administrator user.
      --admin-user=<value>       Username for your administrator user.
      --site-title=<value>       site title for your NEOS installation.
      --version=<value>          (required) [default: latest] version of NEOS to be installed.
      --wait-timeout=<value>     [default: 600s] the duration to wait for the resource to be ready (common units like
                                 'ms', 's', 'm' are accepted).

DESCRIPTION
  Creates new NEOS installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-firstname=<value>  first name of your administrator user.

    The first name that will be used for the first administrator user that is created during the NEOS installation.
    If unspecified, the first name of your mStudio user will be used. This value can be changed after the installation
    is finished.

  --admin-lastname=<value>  Lastname of your administrator user.

    The last name that will be used for the first administrator user that is created during the NEOS installation.
    If unspecified, the last name of your mStudio user will be used. This value can be changed after the installation is
    finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the NEOS installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the NEOS installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --site-title=<value>  site title for your NEOS installation.

    The site title for this NEOS installation. It is also the title shown in the app overview in the mStudio and the
    CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of NEOS to be installed.

    Specify the version in which your NEOS will be installed.
    If unspecified, the NEOS will be installed in the latest available version.
```

## `mw app install nextcloud`

Creates new Nextcloud installation.

```
USAGE
  $ mw app install nextcloud --version <value> [-p <value>] [-q] [--host <value>] [--admin-user <value>] [--admin-email
    <value>] [--admin-pass <value>] [--site-title <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>    ID or short ID of a project; this flag is optional if a default project is set in the
                              context
  -q, --quiet                 suppress process output and only display a machine-readable summary.
  -w, --wait                  wait for the resource to be ready.
      --admin-email=<value>   email address of your administrator user.
      --admin-pass=<value>    password of your administrator user.
      --admin-user=<value>    Username for your administrator user.
      --host=<value>          host to initially configure your Nextcloud installation with; needs to be created
                              separately.
      --site-title=<value>    site title for your Nextcloud installation.
      --version=<value>       (required) [default: latest] version of Nextcloud to be installed.
      --wait-timeout=<value>  [default: 600s] the duration to wait for the resource to be ready (common units like 'ms',
                              's', 'm' are accepted).

DESCRIPTION
  Creates new Nextcloud installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the Nextcloud installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the Nextcloud installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the Nextcloud installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --host=<value>  host to initially configure your Nextcloud installation with; needs to be created separately.

    Specify a host which will be used during the installation and as an initial host for the Nextcloud configuration.
    If unspecified, the default host for the given project will be used.
    This does not change the target of the used host and can be changed later by configuring the host and your Nextcloud
    installation.

  --site-title=<value>  site title for your Nextcloud installation.

    The site title for this Nextcloud installation. It is also the title shown in the app overview in the mStudio and
    the CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of Nextcloud to be installed.

    Specify the version in which your Nextcloud will be installed.
    If unspecified, the Nextcloud will be installed in the latest available version.
```

## `mw app install prestashop`

Creates new PrestaShop installation.

```
USAGE
  $ mw app install prestashop --version <value> [-p <value>] [-q] [--host <value>] [--admin-email <value>] [--admin-pass
    <value>] [--admin-firstname <value>] [--admin-lastname <value>] [--site-title <value>] [--shop-lang <value>] [-w]
    [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>       ID or short ID of a project; this flag is optional if a default project is set in the
                                 context
  -q, --quiet                    suppress process output and only display a machine-readable summary.
  -w, --wait                     wait for the resource to be ready.
      --admin-email=<value>      email address of your administrator user.
      --admin-firstname=<value>  first name of your administrator user.
      --admin-lastname=<value>   Lastname of your administrator user.
      --admin-pass=<value>       password of your administrator user.
      --host=<value>             host to initially configure your PrestaShop installation with; needs to be created
                                 separately.
      --shop-lang=<value>        language your PrestaShop will be working with.
      --site-title=<value>       site title for your PrestaShop installation.
      --version=<value>          (required) [default: latest] version of PrestaShop to be installed.
      --wait-timeout=<value>     [default: 600s] the duration to wait for the resource to be ready (common units like
                                 'ms', 's', 'm' are accepted).

DESCRIPTION
  Creates new PrestaShop installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the PrestaShop installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-firstname=<value>  first name of your administrator user.

    The first name that will be used for the first administrator user that is created during the PrestaShop
    installation.
    If unspecified, the first name of your mStudio user will be used. This value can be changed after the installation
    is finished.

  --admin-lastname=<value>  Lastname of your administrator user.

    The last name that will be used for the first administrator user that is created during the PrestaShop installation.
    If unspecified, the last name of your mStudio user will be used. This value can be changed after the installation is
    finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the PrestaShop installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --host=<value>  host to initially configure your PrestaShop installation with; needs to be created separately.

    Specify a host which will be used during the installation and as an initial host for the PrestaShop configuration.
    If unspecified, the default host for the given project will be used.
    This does not change the target of the used host and can be changed later by configuring the host and your
    PrestaShop installation.

  --shop-lang=<value>  language your PrestaShop will be working with.

    The default language your PrestaShop installation will be using. The front- and back end will be displayed using the
    given language.
    If unspecified, this will default to German (de_DE). The language can be changed after the installation is finished.

  --site-title=<value>  site title for your PrestaShop installation.

    The site title for this PrestaShop installation. It is also the title shown in the app overview in the mStudio and
    the CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of PrestaShop to be installed.

    Specify the version in which your PrestaShop will be installed.
    If unspecified, the PrestaShop will be installed in the latest available version.
```

## `mw app install shopware5`

Creates new Shopware 5 installation.

```
USAGE
  $ mw app install shopware5 --version <value> [-p <value>] [-q] [--host <value>] [--admin-user <value>] [--admin-email
    <value>] [--admin-pass <value>] [--admin-firstname <value>] [--admin-lastname <value>] [--site-title <value>]
    [--shop-email <value>] [--shop-lang <value>] [--shop-currency <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>       ID or short ID of a project; this flag is optional if a default project is set in the
                                 context
  -q, --quiet                    suppress process output and only display a machine-readable summary.
  -w, --wait                     wait for the resource to be ready.
      --admin-email=<value>      email address of your administrator user.
      --admin-firstname=<value>  first name of your administrator user.
      --admin-lastname=<value>   Lastname of your administrator user.
      --admin-pass=<value>       password of your administrator user.
      --admin-user=<value>       Username for your administrator user.
      --host=<value>             host to initially configure your Shopware 5 installation with; needs to be created
                                 separately.
      --shop-currency=<value>    Currency your Shopware 5 will be working with.
      --shop-email=<value>       email address your Shopware 5 will be working with.
      --shop-lang=<value>        language your Shopware 5 will be working with.
      --site-title=<value>       site title for your Shopware 5 installation.
      --version=<value>          (required) [default: latest] version of Shopware 5 to be installed.
      --wait-timeout=<value>     [default: 600s] the duration to wait for the resource to be ready (common units like
                                 'ms', 's', 'm' are accepted).

DESCRIPTION
  Creates new Shopware 5 installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the Shopware 5 installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-firstname=<value>  first name of your administrator user.

    The first name that will be used for the first administrator user that is created during the Shopware 5
    installation.
    If unspecified, the first name of your mStudio user will be used. This value can be changed after the installation
    is finished.

  --admin-lastname=<value>  Lastname of your administrator user.

    The last name that will be used for the first administrator user that is created during the Shopware 5 installation.
    If unspecified, the last name of your mStudio user will be used. This value can be changed after the installation is
    finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the Shopware 5 installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the Shopware 5 installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --host=<value>  host to initially configure your Shopware 5 installation with; needs to be created separately.

    Specify a host which will be used during the installation and as an initial host for the Shopware 5 configuration.
    If unspecified, the default host for the given project will be used.
    This does not change the target of the used host and can be changed later by configuring the host and your Shopware
    5 installation.

  --shop-currency=<value>  Currency your Shopware 5 will be working with.

    The default currency your Shopware 5 shop communicates prices and calculates transactions with.
    If unspecified, this will default to EUR(€). The currency can be changed after the installation is finished.

  --shop-email=<value>  email address your Shopware 5 will be working with.

    The email address your Shopware 5 installation will be using for correspondence with end users.
    If unspecified, your mStudio account email will be used. This email address can be changed after the installation is
    finished.

  --shop-lang=<value>  language your Shopware 5 will be working with.

    The default language your Shopware 5 installation will be using. The front- and back end will be displayed using the
    given language.
    If unspecified, this will default to German (de_DE). The language can be changed after the installation is finished.

  --site-title=<value>  site title for your Shopware 5 installation.

    The site title for this Shopware 5 installation. It is also the title shown in the app overview in the mStudio and
    the CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of Shopware 5 to be installed.

    Specify the version in which your Shopware 5 will be installed.
    If unspecified, the Shopware 5 will be installed in the latest available version.
```

## `mw app install shopware6`

Creates new Shopware 6 installation.

```
USAGE
  $ mw app install shopware6 --version <value> [-p <value>] [-q] [--host <value>] [--admin-user <value>] [--admin-email
    <value>] [--admin-pass <value>] [--admin-firstname <value>] [--admin-lastname <value>] [--site-title <value>]
    [--shop-email <value>] [--shop-lang <value>] [--shop-currency <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>       ID or short ID of a project; this flag is optional if a default project is set in the
                                 context
  -q, --quiet                    suppress process output and only display a machine-readable summary.
  -w, --wait                     wait for the resource to be ready.
      --admin-email=<value>      email address of your administrator user.
      --admin-firstname=<value>  first name of your administrator user.
      --admin-lastname=<value>   Lastname of your administrator user.
      --admin-pass=<value>       password of your administrator user.
      --admin-user=<value>       Username for your administrator user.
      --host=<value>             host to initially configure your Shopware 6 installation with; needs to be created
                                 separately.
      --shop-currency=<value>    Currency your Shopware 6 will be working with.
      --shop-email=<value>       email address your Shopware 6 will be working with.
      --shop-lang=<value>        language your Shopware 6 will be working with.
      --site-title=<value>       site title for your Shopware 6 installation.
      --version=<value>          (required) [default: latest] version of Shopware 6 to be installed.
      --wait-timeout=<value>     [default: 600s] the duration to wait for the resource to be ready (common units like
                                 'ms', 's', 'm' are accepted).

DESCRIPTION
  Creates new Shopware 6 installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the Shopware 6 installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-firstname=<value>  first name of your administrator user.

    The first name that will be used for the first administrator user that is created during the Shopware 6
    installation.
    If unspecified, the first name of your mStudio user will be used. This value can be changed after the installation
    is finished.

  --admin-lastname=<value>  Lastname of your administrator user.

    The last name that will be used for the first administrator user that is created during the Shopware 6 installation.
    If unspecified, the last name of your mStudio user will be used. This value can be changed after the installation is
    finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the Shopware 6 installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the Shopware 6 installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --host=<value>  host to initially configure your Shopware 6 installation with; needs to be created separately.

    Specify a host which will be used during the installation and as an initial host for the Shopware 6 configuration.
    If unspecified, the default host for the given project will be used.
    This does not change the target of the used host and can be changed later by configuring the host and your Shopware
    6 installation.

  --shop-currency=<value>  Currency your Shopware 6 will be working with.

    The default currency your Shopware 6 shop communicates prices and calculates transactions with.
    If unspecified, this will default to EUR(€). The currency can be changed after the installation is finished.

  --shop-email=<value>  email address your Shopware 6 will be working with.

    The email address your Shopware 6 installation will be using for correspondence with end users.
    If unspecified, your mStudio account email will be used. This email address can be changed after the installation is
    finished.

  --shop-lang=<value>  language your Shopware 6 will be working with.

    The default language your Shopware 6 installation will be using. The front- and back end will be displayed using the
    given language.
    If unspecified, this will default to German (de_DE). The language can be changed after the installation is finished.

  --site-title=<value>  site title for your Shopware 6 installation.

    The site title for this Shopware 6 installation. It is also the title shown in the app overview in the mStudio and
    the CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of Shopware 6 to be installed.

    Specify the version in which your Shopware 6 will be installed.
    If unspecified, the Shopware 6 will be installed in the latest available version.
```

## `mw app install typo3`

Creates new TYPO3 installation.

```
USAGE
  $ mw app install typo3 --version <value> --install-mode composer|symlink [-p <value>] [-q] [--host <value>]
    [--admin-user <value>] [--admin-email <value>] [--admin-pass <value>] [--site-title <value>] [-w] [--wait-timeout
    <value>]

FLAGS
  -p, --project-id=<value>     ID or short ID of a project; this flag is optional if a default project is set in the
                               context
  -q, --quiet                  suppress process output and only display a machine-readable summary.
  -w, --wait                   wait for the resource to be ready.
      --admin-email=<value>    email address of your administrator user.
      --admin-pass=<value>     password of your administrator user.
      --admin-user=<value>     Username for your administrator user.
      --host=<value>           host to initially configure your TYPO3 installation with; needs to be created separately.
      --install-mode=<option>  (required) [default: composer] The installation mode your TYPO3 will be installed with.
                               <options: composer|symlink>
      --site-title=<value>     site title for your TYPO3 installation.
      --version=<value>        (required) [default: latest] version of TYPO3 to be installed.
      --wait-timeout=<value>   [default: 600s] the duration to wait for the resource to be ready (common units like
                               'ms', 's', 'm' are accepted).

DESCRIPTION
  Creates new TYPO3 installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the TYPO3 installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the TYPO3 installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the TYPO3 installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --host=<value>  host to initially configure your TYPO3 installation with; needs to be created separately.

    Specify a host which will be used during the installation and as an initial host for the TYPO3 configuration.
    If unspecified, the default host for the given project will be used.
    This does not change the target of the used host and can be changed later by configuring the host and your TYPO3
    installation.

  --install-mode=composer|symlink  The installation mode your TYPO3 will be installed with.

    TYPO3 can be installed in one of two different ways: either as a composer project or in a more manual fashion using
    the source directory and the TYPO3 console install wizard.
    If unspecified, this will default to a composer-based installation. This can not be changed later.

  --site-title=<value>  site title for your TYPO3 installation.

    The site title for this TYPO3 installation. It is also the title shown in the app overview in the mStudio and the
    CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of TYPO3 to be installed.

    Specify the version in which your TYPO3 will be installed.
    If unspecified, the TYPO3 will be installed in the latest available version.
```

## `mw app install wordpress`

Creates new WordPress installation.

```
USAGE
  $ mw app install wordpress --version <value> [-p <value>] [-q] [--host <value>] [--admin-user <value>] [--admin-email
    <value>] [--admin-pass <value>] [--site-title <value>] [-w] [--wait-timeout <value>]

FLAGS
  -p, --project-id=<value>    ID or short ID of a project; this flag is optional if a default project is set in the
                              context
  -q, --quiet                 suppress process output and only display a machine-readable summary.
  -w, --wait                  wait for the resource to be ready.
      --admin-email=<value>   email address of your administrator user.
      --admin-pass=<value>    password of your administrator user.
      --admin-user=<value>    Username for your administrator user.
      --host=<value>          host to initially configure your WordPress installation with; needs to be created
                              separately.
      --site-title=<value>    site title for your WordPress installation.
      --version=<value>       (required) [default: latest] version of WordPress to be installed.
      --wait-timeout=<value>  [default: 600s] the duration to wait for the resource to be ready (common units like 'ms',
                              's', 'm' are accepted).

DESCRIPTION
  Creates new WordPress installation.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --admin-email=<value>  email address of your administrator user.

    email address that will be used for the first administrator user that is created during the WordPress installation.
    If unspecified, email address of your mStudio account will be used. This email address can be changed after the
    installation is finished.

  --admin-pass=<value>  password of your administrator user.

    The password that will be used for the first administrator user that is created during the WordPress installation.
    If unspecified, a random secure password will be generated and printed to stdout. This password can be changed after
    the installation is finished

  --admin-user=<value>  Username for your administrator user.

    Username of the first administrator user which will be created during the WordPress installation.
    If unspecified, an adequate username will be generated.
    After the installation is finished, the username can be changed and additional administrator users can be created.

  --host=<value>  host to initially configure your WordPress installation with; needs to be created separately.

    Specify a host which will be used during the installation and as an initial host for the WordPress configuration.
    If unspecified, the default host for the given project will be used.
    This does not change the target of the used host and can be changed later by configuring the host and your WordPress
    installation.

  --site-title=<value>  site title for your WordPress installation.

    The site title for this WordPress installation. It is also the title shown in the app overview in the mStudio and
    the CLI.
    If unspecified, the application name and the given project ID will be used. The title can be changed after the
    installation is finished

  --version=<value>  version of WordPress to be installed.

    Specify the version in which your WordPress will be installed.
    If unspecified, the WordPress will be installed in the latest available version.
```

## `mw app list`

List installed apps in a project.

```
USAGE
  $ mw app list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List installed apps in a project.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw app list-upgrade-candidates [INSTALLATION-ID]`

List upgrade candidates for an app installation.

```
USAGE
  $ mw app list-upgrade-candidates [INSTALLATION-ID] -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate]
    [--no-relative-dates] [--csv-separator ,|;]

ARGUMENTS
  INSTALLATION-ID  ID or short ID of an app installation; this argument is optional if a default app installation is set
                   in the context.

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
  List upgrade candidates for an app installation.
```

## `mw app ssh [INSTALLATION-ID]`

Connect to an app via SSH

```
USAGE
  $ mw app ssh [INSTALLATION-ID] [--ssh-user <value>] [--ssh-identity-file <value>] [--cd] [--info] [--test]

ARGUMENTS
  INSTALLATION-ID  ID or short ID of an app installation; this argument is optional if a default app installation is set
                   in the context.

FLAGS
  --[no-]cd  change to installation path after connecting
  --info     only print connection information, without actually connecting
  --test     test connection and exit

SSH CONNECTION FLAGS
  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.
  --ssh-user=<value>           override the SSH user to connect with; if omitted, your own user will be used

DESCRIPTION
  Connect to an app via SSH

  Establishes an interactive SSH connection to an app installation.

  This command is a wrapper around your systems SSH client, and will respect your SSH configuration in ~/.ssh/config.

  An exception to this is the 'User' configuration, which will be overridden by this command to either your
  authenticated mStudio user or the user specified with the --ssh-user flag.

  See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.

FLAG DESCRIPTIONS
  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.

    The SSH identity file to use for the connection. This file should contain an SSH private key and will be used to
    authenticate the connection to the server.

    You can also set this value by setting the MITTWALD_SSH_IDENTITY_FILE environment variable.

  --ssh-user=<value>  override the SSH user to connect with; if omitted, your own user will be used

    This flag can be used to override the SSH user that is used for a connection; be default, your own personal user
    will be used for this.

    You can also set this value by setting the MITTWALD_SSH_USER environment variable.
```

## `mw app uninstall [INSTALLATION-ID]`

Uninstall an app

```
USAGE
  $ mw app uninstall [INSTALLATION-ID] [-q] [-f]

ARGUMENTS
  INSTALLATION-ID  ID or short ID of an app installation; this argument is optional if a default app installation is set
                   in the context.

FLAGS
  -f, --force  Do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Uninstall an app

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw app update [INSTALLATION-ID]`

Update properties of an app installation (use 'upgrade' to update the app version)

```
USAGE
  $ mw app update [INSTALLATION-ID] [-q] [--description <value>] [--entrypoint <value>] [--document-root <value>]

ARGUMENTS
  INSTALLATION-ID  ID or short ID of an app installation; this argument is optional if a default app installation is set
                   in the context.

FLAGS
  -q, --quiet                  suppress process output and only display a machine-readable summary.
      --description=<value>    update the description of the app installation
      --document-root=<value>  update the document root of the app installation
      --entrypoint=<value>     update the entrypoint of the app installation (Python and Node.js only)

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --description=<value>  update the description of the app installation

    This flag updates the description of the app installation. If omitted, the description will not be changed.

  --document-root=<value>  update the document root of the app installation

    Updates the document root of the app installation. If omitted, the document root will not be changed. Note that not
    all apps support this field.

  --entrypoint=<value>  update the entrypoint of the app installation (Python and Node.js only)

    Updates the entrypoint of the app installation. If omitted, the entrypoint will not be changed. Note that this field
    is only available for some types of apps (like Python and Node.js).
```

## `mw app upgrade [INSTALLATION-ID]`

Upgrade app installation to target version

```
USAGE
  $ mw app upgrade [INSTALLATION-ID] [--target-version <value>] [-f] [-p <value>] [-q] [-w] [--wait-timeout
    <value>]

ARGUMENTS
  INSTALLATION-ID  ID or short ID of an app installation; this argument is optional if a default app installation is set
                   in the context.

FLAGS
  -f, --force                   Do not ask for confirmation.
  -p, --project-id=<value>      ID or short ID of a project; this flag is optional if a default project is set in the
                                context
  -q, --quiet                   suppress process output and only display a machine-readable summary.
  -w, --wait                    wait for the resource to be ready.
      --target-version=<value>  target version to upgrade app to; if omitted, target version will be prompted
                                interactively
      --wait-timeout=<value>    [default: 600s] the duration to wait for the resource to be ready (common units like
                                'ms', 's', 'm' are accepted).

DESCRIPTION
  Upgrade app installation to target version

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw app upload [INSTALLATION-ID]`

Upload the filesystem of an app to a project

```
USAGE
  $ mw app upload [INSTALLATION-ID] --source <value> [-q] [--ssh-user <value>] [--ssh-identity-file <value>]
    [--exclude <value>...] [--dry-run] [--delete]

ARGUMENTS
  INSTALLATION-ID  ID or short ID of an app installation; this argument is optional if a default app installation is set
                   in the context.

FLAGS
  -q, --quiet               suppress process output and only display a machine-readable summary.
      --delete              delete remote files that are not present locally
      --dry-run             do not actually upload the app installation
      --exclude=<value>...  [default: ] exclude files matching the given pattern
      --source=<value>      (required) source directory from which to upload the app installation

SSH CONNECTION FLAGS
  --ssh-identity-file=<value>  the SSH identity file (private key) to use for public key authentication.
  --ssh-user=<value>           override the SSH user to connect with; if omitted, your own user will be used

DESCRIPTION
  Upload the filesystem of an app to a project

  Upload the filesystem of an app from your local machine to a project.

  For this, rsync needs to be installed on your system.

  CAUTION: This is a potentially destructive operation. It will overwrite files on the server with the files from your
  local machine. This is NOT a turnkey deployment solution. It is intended for development purposes only.

  This command relies on connecting to your hosting environment via SSH. For this, it will use your systems SSH client
  under the hood, and will respect your SSH configuration in ~/.ssh/config.

  An exception to this is the 'User' configuration, which will be overridden by this command to either your
  authenticated mStudio user or the user specified with the --ssh-user flag.

  See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.

  This command will also look for a file named .mw-rsync-filter in the current directory and use it as a filter file for
  rsync. Have a look at https://manpages.ubuntu.com/manpages/noble/en/man1/rsync.1.html#filter%20rules for more
  information on how to write filter rules.

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

## `mw app versions [APP]`

List supported Apps and Versions

```
USAGE
  $ mw app versions [APP]

ARGUMENTS
  APP  name of specific app to get versions for

DESCRIPTION
  List supported Apps and Versions
```
