`mw domain`
===========

Manage domains, virtual hosts and DNS settings in your projects

* [`mw domain dnszone get DNSZONE-ID`](#mw-domain-dnszone-get-dnszone-id)
* [`mw domain dnszone list`](#mw-domain-dnszone-list)
* [`mw domain dnszone update DNSZONE-ID RECORD-SET`](#mw-domain-dnszone-update-dnszone-id-record-set)
* [`mw domain get DOMAIN-ID`](#mw-domain-get-domain-id)
* [`mw domain list`](#mw-domain-list)
* [`mw domain virtualhost create`](#mw-domain-virtualhost-create)
* [`mw domain virtualhost delete VIRTUAL-HOST-ID`](#mw-domain-virtualhost-delete-virtual-host-id)
* [`mw domain virtualhost get INGRESS-ID`](#mw-domain-virtualhost-get-ingress-id)
* [`mw domain virtualhost list`](#mw-domain-virtualhost-list)

## `mw domain dnszone get DNSZONE-ID`

gets a specific zone

```
USAGE
  $ mw domain dnszone get DNSZONE-ID -o txt|json|yaml

ARGUMENTS
  DNSZONE-ID  ID or domain name of a DNS zone

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  gets a specific zone
```

## `mw domain dnszone list`

list all DNS zones by project ID

```
USAGE
  $ mw domain dnszone list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  list all DNS zones by project ID

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw domain dnszone update DNSZONE-ID RECORD-SET`

Updates a record set of a DNS zone

```
USAGE
  $ mw domain dnszone update DNSZONE-ID RECORD-SET [-q] [-p <value>] [--record <value>... | --managed | --unset] [--ttl
    <value>]

ARGUMENTS
  DNSZONE-ID  ID or domain name of a DNS zone
  RECORD-SET  (a|mx|txt|srv|cname) The record type of the record set

FLAGS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the
                            context
  -q, --quiet               suppress process output and only display a machine-readable summary.
      --managed             Reset this record set to fully-managed (only for A and MX records)
      --record=<value>...   The records to set; may not be used with --managed
      --ttl=<value>         The TTL of the record set; omit to use the default TTL
      --unset               Set this to remove all records from the record set

DESCRIPTION
  Updates a record set of a DNS zone

EXAMPLES
  Set A and AAAA records

    $ mw domain dnszone update domain.example a --record 203.0.113.123 --record 2001:db8::1

  Set MX records

    $ mw domain dnszone update domain.example mx --record "10 mail1.domain.example" --record "20 \
      mail2.domain.example"

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --record=<value>...  The records to set; may not be used with --managed

    The format depends on the record set type:

    - for "a" records, this parameter should contain a IPv4 or IPv6 address (we will automatically create an A or AAAA
    record)
    - for "mx" records, the parameter should be formatted as "<priority> <fqdn>", e.g. "10 mail.example.com"
    - for "srv" records, the parameter should be formatted as "<priority> <weight> <port> <fqdn>", e.g. "10 1 5060
    sip.example.com"
    - for "txt" records, the parameter should be a string containing the TXT record value.
```

## `mw domain get DOMAIN-ID`

gets a specific domain

```
USAGE
  $ mw domain get DOMAIN-ID -o txt|json|yaml

ARGUMENTS
  DOMAIN-ID  ID or domain name of a domain

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  gets a specific domain
```

## `mw domain list`

List domains belonging to a project.

```
USAGE
  $ mw domain list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
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
  List domains belonging to a project.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```

## `mw domain virtualhost create`

Create a new ingress

```
USAGE
  $ mw domain virtualhost create --hostname <value> [-q] [-p <value>] [--path-to-dir <value>...] [--path-to-app <value>...]
    [--path-to-url <value>...]

FLAGS
  -p, --project-id=<value>      ID or short ID of a project; this flag is optional if a default project is set in the
                                context
  -q, --quiet                   suppress process output and only display a machine-readable summary.
      --hostname=<value>        (required) the hostname of the ingress
      --path-to-app=<value>...  add a path mapping to an app
      --path-to-dir=<value>...  add a path mapping to a directory
      --path-to-url=<value>...  add a path mapping to an external url

DESCRIPTION
  Create a new ingress

EXAMPLES
  Create a new ingress, with the root path mapping to your project's root directory

    $ mw domain virtualhost create --hostname mw.example --path-to-dir /:/

  Create a new ingress, with the root path mapping to an app

    $ mw domain virtualhost create --hostname mw.example --path-to-app /:3ecaf1a9-6eb4-4869-b811-8a13c3a2e745

  Create a new ingress, with the root path mapping to a URL

    $ mw domain virtualhost create --hostname mw.example --path-to-url /:https://redirect.example

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.

  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.

  --path-to-app=<value>...  add a path mapping to an app

    This flag can be used to map a specific URL path to an app; the value for this flag should be the URL path and the
    app ID, separated by a colon, e.g. /:3ecaf1a9-6eb4-4869-b811-8a13c3a2e745. You can specify this flag multiple times
    to map multiple paths to different apps, and also combine it with the other --path-to-* flags.

  --path-to-dir=<value>...  add a path mapping to a directory

    This flag can be used to map a specific URL path to a directory in your project's file system; the value for this
    flag should be the URL path and the filesystem path, separated by a colon, e.g. /:/ or /:/some/sub/path. You can
    specify this flag multiple times to map multiple paths to different directories, and also combine it with the other
    --path-to-* flags.

  --path-to-url=<value>...  add a path mapping to an external url

    This flag can be used to map a specific URL path to an external URL; the value for this flag should be the URL path
    and the external URL, separated by a colon, e.g. /:https://redirect.example. You can specify this flag multiple
    times to map multiple paths to different external URLs, and also combine it with the other --path-to-* flags.
```

## `mw domain virtualhost delete VIRTUAL-HOST-ID`

Delete a virtual host

```
USAGE
  $ mw domain virtualhost delete VIRTUAL-HOST-ID [-q] [-f]

ARGUMENTS
  VIRTUAL-HOST-ID  ID of the virtual host to delete

FLAGS
  -f, --force  Do not ask for confirmation
  -q, --quiet  suppress process output and only display a machine-readable summary.

DESCRIPTION
  Delete a virtual host

FLAG DESCRIPTIONS
  -q, --quiet  suppress process output and only display a machine-readable summary.

    This flag controls if you want to see the process output or only a summary. When using mw non-interactively (e.g. in
    scripts), you can use this flag to easily get the IDs of created resources for further processing.
```

## `mw domain virtualhost get INGRESS-ID`

Get a virtual host.

```
USAGE
  $ mw domain virtualhost get INGRESS-ID -o txt|json|yaml

FLAGS
  -o, --output=<option>  (required) [default: txt] output in a more machine friendly format
                         <options: txt|json|yaml>

DESCRIPTION
  Get a virtual host.
```

## `mw domain virtualhost list`

List virtualhosts for a project.

```
USAGE
  $ mw domain virtualhost list -o txt|json|yaml|csv|tsv [-x] [--no-header] [--no-truncate] [--no-relative-dates]
    [--csv-separator ,|;] [-p <value>] [-a]

FLAGS
  -a, --all                     List all virtual hosts that you have access to, regardless of project
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
  List virtualhosts for a project.

FLAG DESCRIPTIONS
  -p, --project-id=<value>  ID or short ID of a project; this flag is optional if a default project is set in the context

    May contain a short ID or a full ID of a project; you can also use the "mw context set --project-id=<VALUE>" command
    to persistently set a default project for all commands that accept this flag.
```
