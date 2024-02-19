# Contributor's guide

This document contains information for contributors to the mittwald CLI. It
contains information on how to contribute code to the CLI, as well as some
general guidelines for the CLI's development. If you are looking for information
on how to use the CLI, please refer to the [README](../README.md).

## General considerations

### Which features should be added to the CLI?

There is no hard rule for this, but the following guidelines should be followed.

Features that should (usually) be added to the CLI:

- Features that are used by developers in the regular lifecycle of a project
  (including setup and teardown)
- Features that might commonly be used in a CI/CD pipeline
- Features that otherwise make sense to be scripted or otherwise automated

Features that would (usually) not be added to the CLI:

- Features that by design depend on a graphical interface (avatar upload, ...)
- Features that a typical user would only use once or twice (registration, ...)
- Features that are obviously easier to use through the web interface (e.g.
  conversation or contract handling)

## Developer's handbook

### Development environment

For a development environment for this CLI, you need:

- Node.JS (>=18)
- Yarn
- 7zip + NSIS (for Windows builds)
- Docker (for building the Docker image)

When you are using an IDE that supports [devcontainers](https://containers.dev),
you can use the provided devcontainer configuration to get a development
environment with all required tools.

### Implementation notes for typical commands

#### Documentation & examples

Every command should have a short description and a long description. The short
description should be a single sentence that describes the purpose of the
command. The long description should be a more detailed description of the
command and explain the purpose, usage and inner workings of the command as
necessary.

Also make use of the `examples` property to provide usage examples for the
command. These examples will be displayed as part of the command's help output.
Examples are useful to demonstrate the usage of flags and arguments, especially
for more complex commands.

#### List commands

List commands should be implemented by inheriting the `ListBaseCommand` and
implementing the abstract `getData` and `mapData` methods. Typically, you will
also want to override the `getColumns` method.

Some implementation hints regarding the table output:

- The first two columns should be the ID and Short ID columns (the latter only
  if the resource has a short ID). Make sure to set the `minWidth` property for
  both columns, as these values are not useful to the user if they are
  truncated.
- If a resource has a short ID, and the short ID can be used in place of the
  regular ID, the columns should present the short ID as the regular ID; in this
  case, the regular ID should be hidden behind the `--extended` flag.
- The last column should be the "created at" column, if the resource has a
  creation date.
- Add other columns as needed. Use the `extended` option to hide columns that
  are not relevant for the user in the default output.

You can re-use the most common column definitions, by invoking
`super.getColumns`, and extracting the columns you need from the result:

```js
const { id, shortId, createdAt } = super.getColumns(row);

return {
  id,
  shortId,
  // ... other columns
  createdAt,
};
```

Every list command should support the `--output=txt|csv|json|yaml` flags to
control the output format. This is automatically supported when inheriting from
`ListBaseCommand`.

#### Detail commands

Any kind of command that displays a single resource should inherit from
`RenderBaseCommand`. This class provides the `render` method that can be used to
render the resource in a text format. The `render` method should return a React
node that renders the resource.

Some implementation notes:

- Use the `<SingleResult>` component to render the individual attributes of the
  resource. Add multiple instances of the `<SingleResult>` component to render
  multiple sections of data for a single resource.
- Use the `<RenderJson>` component to render a JSON representation of the
  resource, if the `--output` flag is set to `json`. Currently, this needs to be
  implemented within the `render` method.

#### Mutating commands

Mutating commands (like `create`, `update` or any more specialized commands)
should inherit from the `ExecRenderBaseCommand`, which can be used to visualize
the progress of long-running processes.

The `ExecRenderBaseCommand` requires you to define a result data type, which
will be printed to stdout when the command completes successfully and JSON
output is required.

Some implementation notes:

- Use the `ProcessRenderer` class (to be instantiated with the
  `makeProcessRenderer` function) to render the progress of the process; the
  class also offers an option to prompt additional/missing input data from the
  user.
- Wrap each long-running operation (API calls, especially when you need to poll
  the results) into its own separate process step.

#### Delete commands

Implement delete commands by inheriting from the `DeleteBaseCommand`. This class
will automatically prompt the user if they want to delete the resource, and will
also handle the case where the user aborts the deletion.

### Contexts

Oftentimes, commands are executed in the context of a certain resource, like an
organization, a project or a server. For the most common of these contexts, we
provide functions to retrieve the respective context. These functions are:

- `withProjectId`
- `withOrganizationId`
- `withServerId`
- `withAppInstallationId`
- possibly more to come

Using these functions typically requires providing an argument or a flag to the
respective command that can be used to specify the respective context ID, when
it can not be retrieved by any other means:

```ts
import { projectFlags } from "./flags";
import { ExtendedBaseCommand } from "./ExtendedBaseCommand";

class MyCommand extends ExtendedBaseCommand<typeof MyCommand> {
  static flags = {
    ...projectFlags,
  };
}
```

### Inputs/Outputs

Use flags and arguments to model inputs. Follow the following guidelines when
defining flags and arguments:

- Use flags for optional inputs
- Use arguments for required inputs; commands that affect an existing resource
  should accept that resource's ID as the first argument.
- Both should be named in `kebab-case`
