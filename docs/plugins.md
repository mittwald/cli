`mw plugins`
============

List installed plugins.

* [`mw plugins`](#mw-plugins)
* [`mw plugins add PLUGIN`](#mw-plugins-add-plugin)
* [`mw plugins:inspect PLUGIN...`](#mw-pluginsinspect-plugin)
* [`mw plugins install PLUGIN`](#mw-plugins-install-plugin)
* [`mw plugins link PATH`](#mw-plugins-link-path)
* [`mw plugins remove [PLUGIN]`](#mw-plugins-remove-plugin)
* [`mw plugins reset`](#mw-plugins-reset)
* [`mw plugins uninstall [PLUGIN]`](#mw-plugins-uninstall-plugin)
* [`mw plugins unlink [PLUGIN]`](#mw-plugins-unlink-plugin)
* [`mw plugins update`](#mw-plugins-update)

## `mw plugins`

List installed plugins.

```
USAGE
  $ mw plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ mw plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/7.0.18/src/commands/plugins/index.ts)_

## `mw plugins add PLUGIN`

Installs a plugin into mw.

```
USAGE
  $ mw plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into mw.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the MW_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MW_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ mw plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ mw plugins add myplugin

  Install a plugin from a github url.

    $ mw plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ mw plugins add someuser/someplugin
```

## `mw plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ mw plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ mw plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/7.0.18/src/commands/plugins/inspect.ts)_

## `mw plugins install PLUGIN`

Installs a plugin into mw.

```
USAGE
  $ mw plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into mw.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the MW_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MW_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ mw plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ mw plugins install myplugin

  Install a plugin from a github url.

    $ mw plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ mw plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/7.0.18/src/commands/plugins/install.ts)_

## `mw plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ mw plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ mw plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/7.0.18/src/commands/plugins/link.ts)_

## `mw plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ mw plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mw plugins unlink
  $ mw plugins remove

EXAMPLES
  $ mw plugins remove myplugin
```

## `mw plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ mw plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/7.0.18/src/commands/plugins/reset.ts)_

## `mw plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ mw plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mw plugins unlink
  $ mw plugins remove

EXAMPLES
  $ mw plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/7.0.18/src/commands/plugins/uninstall.ts)_

## `mw plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ mw plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mw plugins unlink
  $ mw plugins remove

EXAMPLES
  $ mw plugins unlink myplugin
```

## `mw plugins update`

Update installed plugins.

```
USAGE
  $ mw plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/7.0.18/src/commands/plugins/update.ts)_
