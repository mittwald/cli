<center>

# `mw` &mdash; the mittwald command-line tool

![](docs/demo.png)

</center>

## Synposis

`mw` is the command-line tool for interacting with the mittwald mStudio v2 API.

## Getting started

### Installation

#### macOS, using Homebrew

Installation using [Homebrew](https://brew.sh/) is the recommended way of
installation on macOS.

```shell
$ brew tap mittwald/cli
$ brew install mw
```

#### Windows, using the Installer

Find the appropriate Windows installer from the
[releases page](https://github.com/mittwald/cli/releases) and run the installer.
After running the installer, you should be able to use the `mw` command on
either the CMD prompt or PowerShell.

#### Any OS, using Node.js+NPM

Installing the CLI via NPM will work on any OS; however we cannot guarantee
stability, because functionality of the CLI may depend on the Node.js runtime
already installed on your system. Also, the automatic upgrade will not work when
using NPM; remember to run `npm upgrade -g @mittwald/cli` occasionally.

```shell
$ npm install -g @mittwald/cli
```

Attention! When installing via `-g` flag, make sure you have nodejs >= 20.7.0
installed, as package definition is ignored for global installations!

#### Any OS, using Docker

There is also the
[`mittwald/cli` Docker image](https://hub.docker.com/r/mittwald/cli) that you
can use instead of installing the CLI on your system. In case of the Docker
container, authentication works a bit differently than described below: Make
sure that there is an environment variable `MITTWALD_API_TOKEN` present on your
system; you can then pass that environment variable into your container:

```shell
$ export MITTWALD_API_TOKEN=<enter token here>
$ docker run --rm -it -e MITTWALD_API_TOKEN mittwald/cli help
```

### Authentication

To use the CLI, you will need an
[mStudio API token](https://studio.mittwald.de/app/profile/api-tokens). With
your token in your clipboard, run the `mw login token` command:

```shell
$ mw login token
Enter your mStudio API token: ****************
token saved to '/Users/mhelmich/.config/mw/token'
```

### Setting up shell autocompletion

The `mw` CLI offers a lot of commands and flags, and it can be hard to remember
all of them. To make your life easier, the CLI offers autocompletion for the
Bash and ZSH shells. To enable autocompletion, run the following command:

```shell
$ mw autocomplete
```

After that, follow the instructions printed by that command (those are specific
to your shell -- Bash, ZSH and Powershell are supported).

## Contributing

If you are a developer (either at @mittwald or an external contributor) and want
to contribute to the CLI, please refer to the [CONTRIBUTING.md](CONTRIBUTING.md)
document.

## Usage

```sh-session
$ npm install -g @mittwald/cli
$ mw COMMAND
running command...
$ mw (--version)
@mittwald/cli/1.0.0 darwin-arm64 node-v18.11.0
$ mw --help [COMMAND]
USAGE
  $ mw COMMAND
...
```

<!-- prettier-ignore-start -->
<!-- commands -->
# Command Topics

* [`mw app`](docs/app.md) - Manage apps, and app installations in your projects
* [`mw autocomplete`](docs/autocomplete.md) - Display autocomplete installation instructions.
* [`mw backup`](docs/backup.md) - Manage backups of your projects
* [`mw container`](docs/container.md) - Manage containers
* [`mw context`](docs/context.md) - Save certain environment parameters for later use
* [`mw conversation`](docs/conversation.md) - Manage your support cases
* [`mw cronjob`](docs/cronjob.md) - Manage cronjobs of your projects
* [`mw database`](docs/database.md) - Manage databases (like MySQL and Redis) in your projects
* [`mw ddev`](docs/ddev.md) - Integrate your mittwald projects with DDEV
* [`mw domain`](docs/domain.md) - Manage domains, virtual hosts and DNS settings in your projects
* [`mw extension`](docs/extension.md) - Install and manage extensions in your organisations and projects
* [`mw help`](docs/help.md) - Display help for mw.
* [`mw login`](docs/login.md) - Manage your client authentication
* [`mw mail`](docs/mail.md) - Manage mailboxes and mail addresses in your projects
* [`mw org`](docs/org.md) - Manage your organizations, and also any kinds of user memberships concerning these organizations.
* [`mw project`](docs/project.md) - Manage your projects, and also any kinds of user memberships concerning these projects.
* [`mw registry`](docs/registry.md) - Manage container registries
* [`mw server`](docs/server.md) - Manage your servers
* [`mw sftp-user`](docs/sftp-user.md) - Manage SFTP users of your projects
* [`mw ssh-user`](docs/ssh-user.md) - Manage SSH users of your projects
* [`mw stack`](docs/stack.md) - Manage container stacks
* [`mw update`](docs/update.md) - update the mw CLI
* [`mw user`](docs/user.md) - Manage your own user account
* [`mw volume`](docs/volume.md) - Manage volumes

<!-- commandsstop -->
<!-- prettier-ignore-end -->
