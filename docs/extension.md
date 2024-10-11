`mw extension`
==============

Install an extension in a project or organization

* [`mw extension install EXTENSION-ID`](#mw-extension-install-extension-id)
* [`mw extension list`](#mw-extension-list)
* [`mw extension list-installed`](#mw-extension-list-installed)
* [`mw extension uninstall EXTENSION-INSTANCE-ID`](#mw-extension-uninstall-extension-instance-id)

## `mw extension install EXTENSION-ID`

Install an extension in a project or organization

```
USAGE
  $ mw extension install EXTENSION-ID [-q] [--org-id <value>] [--project-id <value>] [--consent]

ARGUMENTS
  EXTENSION-ID  the ID of the extension to install

FLAGS
  -q, --quiet               suppress process output and only display a machine-readable summary.
      --consent             consent to the extension having access to the requested scopes
      --org-id=<value>      the ID of the organization to install the extension in
      --project-id=<value>  the ID of the project to install the extension in

DESCRIPTION
  Install an extension in a project or organization

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw extension list`

Get all available extensions.

```
USAGE
  $ mw extension list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  Get all available extensions.
```

## `mw extension list-installed`

List installed extensions in an organization or project.

```
USAGE
  $ mw extension list-installed -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
    [--csv-separator ,|;] [--org-id <value>] [--project-id <value>]

FLAGS
  -o, --output=<option>         (required) [default: txt] output in a more machine friendly format
                                <options: txt|json|yaml|csv|tsv>
  -x, --extended                show extended information
      --csv-separator=<option>  [default: ,] separator for CSV output (only relevant for CSV output)
                                <options: ,|;>
      --no-header               hide table header
      --no-relative-dates       show dates in absolute format, not relative (only relevant for txt output)
      --no-truncate             do not truncate output (only relevant for txt output)
      --org-id=<value>          the ID of the organization to install the extension in
      --project-id=<value>      the ID of the project to install the extension in

DESCRIPTION
  List installed extensions in an organization or project.
```

## `mw extension uninstall EXTENSION-INSTANCE-ID`

Remove an extension from an organization

```
USAGE
  $ mw extension uninstall EXTENSION-INSTANCE-ID [-q]

ARGUMENTS
  EXTENSION-INSTANCE-ID  the ID of the extension instance to uninstall

FLAGS
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Remove an extension from an organization

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```
