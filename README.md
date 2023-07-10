<center>

# `mw` -- the mittwald command-line tool

![](docs/demo.png)

</center>

> ⚠️ **EXPERIMENTAL -- STABILITY NOTICE**
>
> This project is **experimental**, and we do not offer any stability guarantees of any kind for the command structure, input flags and arguments and output formats. We welcome you to give this project a try and we're looking forward for any feedback on this project in this stage of development. However, please do not rely on any inputs or outputs of this project to remain stable.

## Synposis

`mw` is the command-line tool for interacting with the mittwald mStudio v2 API.

## Installation and first steps

Have a look at the [documentation](https://developer.mittwald.de/docs/v2/api/sdks/cli/) for installation instructions.

## Usage

<!-- usage -->
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
<!-- usagestop -->

## Commands

<!-- commands -->
* [`mw app delete ID`](#mw-app-delete-id)
* [`mw app dependency getSystemsoftware SYSTEMSOFTWAREID`](#mw-app-dependency-getsystemsoftware-systemsoftwareid)
* [`mw app dependency getSystemsoftwareversion SYSTEMSOFTWAREVERSIONID`](#mw-app-dependency-getsystemsoftwareversion-systemsoftwareversionid)
* [`mw app dependency listSystemsoftwares`](#mw-app-dependency-listsystemsoftwares)
* [`mw app dependency listSystemsoftwareversions`](#mw-app-dependency-listsystemsoftwareversions)
* [`mw app get APPINSTALLATIONID`](#mw-app-get-appinstallationid)
* [`mw app install wordpress`](#mw-app-install-wordpress)
* [`mw app list`](#mw-app-list)
* [`mw app versions [APP]`](#mw-app-versions-app)
* [`mw article getArticle ARTICLEID`](#mw-article-getarticle-articleid)
* [`mw article listArticles`](#mw-article-listarticles)
* [`mw contract getBaseItemOfContract`](#mw-contract-getbaseitemofcontract)
* [`mw contract getDetailOfContract CONTRACTID`](#mw-contract-getdetailofcontract-contractid)
* [`mw contract getDetailOfContractByDomain`](#mw-contract-getdetailofcontractbydomain)
* [`mw contract getDetailOfContractByProject`](#mw-contract-getdetailofcontractbyproject)
* [`mw contract getDetailOfContractByServer`](#mw-contract-getdetailofcontractbyserver)
* [`mw contract getDetailOfContractItem CONTRACTITEMID`](#mw-contract-getdetailofcontractitem-contractitemid)
* [`mw contract getNextTerminationDateForItem`](#mw-contract-getnextterminationdateforitem)
* [`mw contract invoiceDetailOfInvoice INVOICEID`](#mw-contract-invoicedetailofinvoice-invoiceid)
* [`mw contract invoiceGetDetailOfInvoiceSettings`](#mw-contract-invoicegetdetailofinvoicesettings)
* [`mw contract invoiceListCustomerInvoices`](#mw-contract-invoicelistcustomerinvoices)
* [`mw contract listContracts`](#mw-contract-listcontracts)
* [`mw contract orderGetOrder ORDERID`](#mw-contract-ordergetorder-orderid)
* [`mw contract orderListCustomerOrders`](#mw-contract-orderlistcustomerorders)
* [`mw contract orderListProjectOrders`](#mw-contract-orderlistprojectorders)
* [`mw conversation categories`](#mw-conversation-categories)
* [`mw conversation close ID`](#mw-conversation-close-id)
* [`mw conversation create`](#mw-conversation-create)
* [`mw conversation list`](#mw-conversation-list)
* [`mw conversation reply ID`](#mw-conversation-reply-id)
* [`mw conversation show ID`](#mw-conversation-show-id)
* [`mw conversation show2 CONVERSATIONID`](#mw-conversation-show2-conversationid)
* [`mw customer getCustomer CUSTOMERID`](#mw-customer-getcustomer-customerid)
* [`mw customer getCustomerCategory CATEGORYID`](#mw-customer-getcustomercategory-categoryid)
* [`mw customer getCustomerInvite INVITEID`](#mw-customer-getcustomerinvite-inviteid)
* [`mw customer getCustomerMembership MEMBERSHIPID`](#mw-customer-getcustomermembership-membershipid)
* [`mw customer getCustomerTokenInvite`](#mw-customer-getcustomertokeninvite)
* [`mw customer isCustomerLegallyCompetent`](#mw-customer-iscustomerlegallycompetent)
* [`mw customer listCustomerInvites`](#mw-customer-listcustomerinvites)
* [`mw customer listCustomerMemberships`](#mw-customer-listcustomermemberships)
* [`mw customer listCustomers`](#mw-customer-listcustomers)
* [`mw customer listInvitesForCustomer`](#mw-customer-listinvitesforcustomer)
* [`mw customer listMembershipsForCustomer`](#mw-customer-listmembershipsforcustomer)
* [`mw customer listOfCustomerCategories`](#mw-customer-listofcustomercategories)
* [`mw database mysql charsets`](#mw-database-mysql-charsets)
* [`mw database mysql get ID`](#mw-database-mysql-get-id)
* [`mw database mysql list`](#mw-database-mysql-list)
* [`mw database mysql user get ID`](#mw-database-mysql-user-get-id)
* [`mw database mysql user getMysqlUserPhpMyAdminUrl`](#mw-database-mysql-user-getmysqluserphpmyadminurl)
* [`mw database mysql user list`](#mw-database-mysql-user-list)
* [`mw database mysql versions`](#mw-database-mysql-versions)
* [`mw database redis get ID`](#mw-database-redis-get-id)
* [`mw database redis list`](#mw-database-redis-list)
* [`mw database redis versions`](#mw-database-redis-versions)
* [`mw domain dnsZoneGetSpecific ZONEID`](#mw-domain-dnszonegetspecific-zoneid)
* [`mw domain dnsZonesForProject`](#mw-domain-dnszonesforproject)
* [`mw domain get DOMAINID`](#mw-domain-get-domainid)
* [`mw domain getHandleFields DOMAINNAME`](#mw-domain-gethandlefields-domainname)
* [`mw domain getSpecificDomainOwnership DOMAINOWNERSHIPID`](#mw-domain-getspecificdomainownership-domainownershipid)
* [`mw domain list`](#mw-domain-list)
* [`mw domain listDomainOwnerships`](#mw-domain-listdomainownerships)
* [`mw domain tld get TLD`](#mw-domain-tld-get-tld)
* [`mw domain tld list`](#mw-domain-tld-list)
* [`mw domain virtualhost get INGRESSID`](#mw-domain-virtualhost-get-ingressid)
* [`mw domain virtualhost list`](#mw-domain-virtualhost-list)
* [`mw help [COMMANDS]`](#mw-help-commands)
* [`mw login status`](#mw-login-status)
* [`mw login token`](#mw-login-token)
* [`mw mail address create`](#mw-mail-address-create)
* [`mw mail address delete ID`](#mw-mail-address-delete-id)
* [`mw mail address get ID`](#mw-mail-address-get-id)
* [`mw mail address list`](#mw-mail-address-list)
* [`mw mail deliverybox get ID`](#mw-mail-deliverybox-get-id)
* [`mw mail deliverybox list`](#mw-mail-deliverybox-list)
* [`mw project backup get PROJECTBACKUPID`](#mw-project-backup-get-projectbackupid)
* [`mw project backup list`](#mw-project-backup-list)
* [`mw project backupschedule get PROJECTBACKUPSCHEDULEID`](#mw-project-backupschedule-get-projectbackupscheduleid)
* [`mw project backupschedule list`](#mw-project-backupschedule-list)
* [`mw project create`](#mw-project-create)
* [`mw project cronjob execution get EXECUTIONID`](#mw-project-cronjob-execution-get-executionid)
* [`mw project cronjob execution list`](#mw-project-cronjob-execution-list)
* [`mw project cronjob get CRONJOBID`](#mw-project-cronjob-get-cronjobid)
* [`mw project cronjob list`](#mw-project-cronjob-list)
* [`mw project delete ID`](#mw-project-delete-id)
* [`mw project filesystem directories`](#mw-project-filesystem-directories)
* [`mw project filesystem file-content`](#mw-project-filesystem-file-content)
* [`mw project filesystem files PROJECTID`](#mw-project-filesystem-files-projectid)
* [`mw project filesystem usage`](#mw-project-filesystem-usage)
* [`mw project get ID`](#mw-project-get-id)
* [`mw project invite get INVITEID`](#mw-project-invite-get-inviteid)
* [`mw project invite list`](#mw-project-invite-list)
* [`mw project invite list-own`](#mw-project-invite-list-own)
* [`mw project list`](#mw-project-list)
* [`mw project list1`](#mw-project-list1)
* [`mw project list2`](#mw-project-list2)
* [`mw project membership get MEMBERSHIPID`](#mw-project-membership-get-membershipid)
* [`mw project membership get-own`](#mw-project-membership-get-own)
* [`mw project membership list`](#mw-project-membership-list)
* [`mw project membership list-own`](#mw-project-membership-list-own)
* [`mw project sftp-user list`](#mw-project-sftp-user-list)
* [`mw project ssh ID`](#mw-project-ssh-id)
* [`mw project ssh-user list`](#mw-project-ssh-user-list)
* [`mw project update ID`](#mw-project-update-id)
* [`mw server get SERVERID`](#mw-server-get-serverid)
* [`mw server list`](#mw-server-list)
* [`mw user api-token create`](#mw-user-api-token-create)
* [`mw user api-token get APITOKENID`](#mw-user-api-token-get-apitokenid)
* [`mw user api-token list`](#mw-user-api-token-list)
* [`mw user api-token revoke ID`](#mw-user-api-token-revoke-id)
* [`mw user get`](#mw-user-get)
* [`mw user session get TOKENID`](#mw-user-session-get-tokenid)
* [`mw user session list`](#mw-user-session-list)
* [`mw user ssh-key create`](#mw-user-ssh-key-create)
* [`mw user ssh-key delete ID`](#mw-user-ssh-key-delete-id)
* [`mw user ssh-key get SSHKEYID`](#mw-user-ssh-key-get-sshkeyid)
* [`mw user ssh-key list`](#mw-user-ssh-key-list)

## `mw app delete ID`

Delete an app

```
USAGE
  $ mw app delete ID [-f]

ARGUMENTS
  ID  ID of the app to be deleted.

FLAGS
  -f, --force  delete without prompting for confirmation

DESCRIPTION
  Delete an app
```

## `mw app dependency getSystemsoftware SYSTEMSOFTWAREID`

get a specific `SystemSoftware`

```
USAGE
  $ mw app dependency getSystemsoftware SYSTEMSOFTWAREID [--output json|yaml |  | ]

ARGUMENTS
  SYSTEMSOFTWAREID  undefined

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  get a specific `SystemSoftware`
```

## `mw app dependency getSystemsoftwareversion SYSTEMSOFTWAREVERSIONID`

get a specific `SystemSoftwareVersion`

```
USAGE
  $ mw app dependency getSystemsoftwareversion SYSTEMSOFTWAREVERSIONID --system-software-id <value> [--output json|yaml
  |  | ]

ARGUMENTS
  SYSTEMSOFTWAREVERSIONID  undefined

FLAGS
  --output=<option>             output in a more machine friendly format
                                <options: json|yaml>
  --system-software-id=<value>  (required) undefined

DESCRIPTION
  get a specific `SystemSoftwareVersion`
```

## `mw app dependency listSystemsoftwares`

get all available `SystemSoftware`

```
USAGE
  $ mw app dependency listSystemsoftwares [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  get all available `SystemSoftware`
```

## `mw app dependency listSystemsoftwareversions`

get all available `SystemSoftwareVersions` of a specific `SystemSoftware`

```
USAGE
  $ mw app dependency listSystemsoftwareversions --system-software-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended                show extra columns
  --columns=<value>             only show provided columns (comma-separated)
  --csv                         output is csv format [alias: --output=csv]
  --filter=<value>              filter property by partial string matching, ex: name=foo
  --no-header                   hide table header from output
  --no-truncate                 do not truncate output to fit screen
  --output=<option>             output in a more machine friendly format
                                <options: csv|json|yaml>
  --sort=<value>                property to sort by (prepend '-' for descending)
  --system-software-id=<value>  (required) undefined

DESCRIPTION
  get all available `SystemSoftwareVersions` of a specific `SystemSoftware`
```

## `mw app get APPINSTALLATIONID`

get a specific `AppInstallation`

```
USAGE
  $ mw app get APPINSTALLATIONID [--output json|yaml |  | ]

ARGUMENTS
  APPINSTALLATIONID  undefined

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  get a specific `AppInstallation`
```

## `mw app install wordpress`

Creates new WordPress Installation.

```
USAGE
  $ mw app install wordpress -p <value> --host <value> --admin-user <value> --admin-email <value> --admin-pass <value>
    --site-title <value> [--version <value>] [-w]

FLAGS
  -p, --project-id=<value>  (required) ID of the Project, in which the App will be created.
  -w, --wait                Wait for the App to be ready.
  --admin-email=<value>     (required) First Admin Users E-Mail.
  --admin-pass=<value>      (required) First Admin Users Password.
  --admin-user=<value>      (required) First Admin User for the app.
  --host=<value>            (required) Host under which the App will be available (Needs to be created separately).
  --site-title=<value>      (required) Site Title of the created appInstallation.
  --version=<value>         Version of the App to be created - Defaults to latest

DESCRIPTION
  Creates new WordPress Installation.
```

## `mw app list`

List projects

```
USAGE
  $ mw app list -p <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -p, --project=<value>  (required) project to run the command for
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --sort=<value>         property to sort by (prepend '-' for descending)

DESCRIPTION
  List projects
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

## `mw article getArticle ARTICLEID`

Get an Article.

```
USAGE
  $ mw article getArticle ARTICLEID [--output json|yaml |  | ]

ARGUMENTS
  ARTICLEID  undefined

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get an Article.
```

## `mw article listArticles`

List Articles.

```
USAGE
  $ mw article listArticles [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List Articles.
```

## `mw contract getBaseItemOfContract`

Return the BaseItem of the Contract with the given ID.

```
USAGE
  $ mw contract getBaseItemOfContract --contract-id <value> [--output json|yaml |  | ]

FLAGS
  --contract-id=<value>  (required) The uuid of the Contract from which the BaseItem is to be issued.
  --output=<option>      output in a more machine friendly format
                         <options: json|yaml>

DESCRIPTION
  Return the BaseItem of the Contract with the given ID.
```

## `mw contract getDetailOfContract CONTRACTID`

Returns the Contract with the given ID.

```
USAGE
  $ mw contract getDetailOfContract CONTRACTID [--output json|yaml |  | ]

ARGUMENTS
  CONTRACTID  The uuid of the Contract to be returned.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Returns the Contract with the given ID.
```

## `mw contract getDetailOfContractByDomain`

Return the Contract for the given Domain.

```
USAGE
  $ mw contract getDetailOfContractByDomain --domain-id <value> [--output json|yaml |  | ]

FLAGS
  --domain-id=<value>  (required) undefined
  --output=<option>    output in a more machine friendly format
                       <options: json|yaml>

DESCRIPTION
  Return the Contract for the given Domain.
```

## `mw contract getDetailOfContractByProject`

Return the Contract for the given Project.

```
USAGE
  $ mw contract getDetailOfContractByProject --project-id <value> [--output json|yaml |  | ]

FLAGS
  --output=<option>     output in a more machine friendly format
                        <options: json|yaml>
  --project-id=<value>  (required) undefined

DESCRIPTION
  Return the Contract for the given Project.
```

## `mw contract getDetailOfContractByServer`

Return the Contract for the given Server.

```
USAGE
  $ mw contract getDetailOfContractByServer --server-id <value> [--output json|yaml |  | ]

FLAGS
  --output=<option>    output in a more machine friendly format
                       <options: json|yaml>
  --server-id=<value>  (required) undefined

DESCRIPTION
  Return the Contract for the given Server.
```

## `mw contract getDetailOfContractItem CONTRACTITEMID`

Get the ContractItem with the given ID.

```
USAGE
  $ mw contract getDetailOfContractItem CONTRACTITEMID --contract-id <value> [--output json|yaml |  | ]

ARGUMENTS
  CONTRACTITEMID  The uuid of the ContractItem to be returned.

FLAGS
  --contract-id=<value>  (required) The uuid of the Contract where the desired ContractItem belongs to.
  --output=<option>      output in a more machine friendly format
                         <options: json|yaml>

DESCRIPTION
  Get the ContractItem with the given ID.
```

## `mw contract getNextTerminationDateForItem`

Return the next TerminationDate for the ContractItem with the given ID.

```
USAGE
  $ mw contract getNextTerminationDateForItem --contract-id <value> --contract-item-id <value> [--output json|yaml |  |
  ]

FLAGS
  --contract-id=<value>       (required) The uuid of the Contract where the desired ContractItem belongs to.
  --contract-item-id=<value>  (required) The uuid of the ContractItem whose next TerminationDate is to be displayed.
  --output=<option>           output in a more machine friendly format
                              <options: json|yaml>

DESCRIPTION
  Return the next TerminationDate for the ContractItem with the given ID.
```

## `mw contract invoiceDetailOfInvoice INVOICEID`

Get details of an Invoice.

```
USAGE
  $ mw contract invoiceDetailOfInvoice INVOICEID --customer-id <value> [--output json|yaml |  | ]

ARGUMENTS
  INVOICEID  undefined

FLAGS
  --customer-id=<value>  (required) undefined
  --output=<option>      output in a more machine friendly format
                         <options: json|yaml>

DESCRIPTION
  Get details of an Invoice.
```

## `mw contract invoiceGetDetailOfInvoiceSettings`

Get InvoiceSettings of a Customer.

```
USAGE
  $ mw contract invoiceGetDetailOfInvoiceSettings --customer-id <value> [--output json|yaml |  | ]

FLAGS
  --customer-id=<value>  (required) undefined
  --output=<option>      output in a more machine friendly format
                         <options: json|yaml>

DESCRIPTION
  Get InvoiceSettings of a Customer.
```

## `mw contract invoiceListCustomerInvoices`

List Invoices of a Customer.

```
USAGE
  $ mw contract invoiceListCustomerInvoices --customer-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --customer-id=<value>  (required) undefined
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --sort=<value>         property to sort by (prepend '-' for descending)

DESCRIPTION
  List Invoices of a Customer.
```

## `mw contract listContracts`

Return a list of Contracts for the given Customer.

```
USAGE
  $ mw contract listContracts --customer-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --customer-id=<value>  (required) The uuid of the Customer from whom all Contracts are to be returned.
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --sort=<value>         property to sort by (prepend '-' for descending)

DESCRIPTION
  Return a list of Contracts for the given Customer.
```

## `mw contract orderGetOrder ORDERID`

Get Order for Customer.

```
USAGE
  $ mw contract orderGetOrder ORDERID [--output json|yaml |  | ]

ARGUMENTS
  ORDERID  undefined

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get Order for Customer.
```

## `mw contract orderListCustomerOrders`

Get list of Orders of a Customer.

```
USAGE
  $ mw contract orderListCustomerOrders --customer-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --customer-id=<value>  (required) undefined
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --sort=<value>         property to sort by (prepend '-' for descending)

DESCRIPTION
  Get list of Orders of a Customer.
```

## `mw contract orderListProjectOrders`

Get list of Orders of a Project.

```
USAGE
  $ mw contract orderListProjectOrders --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) undefined
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  Get list of Orders of a Project.
```

## `mw conversation categories`

Get all conversation categories.

```
USAGE
  $ mw conversation categories [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  Get all conversation categories.
```

## `mw conversation close ID`

Close a conversation

```
USAGE
  $ mw conversation close ID

ARGUMENTS
  ID  ID of the conversation to show

DESCRIPTION
  Close a conversation
```

## `mw conversation create`

Create a new conversation

```
USAGE
  $ mw conversation create --title <value> [--message <value> | --message-from <value>] [--editor <value>] [--category
    <value>]

FLAGS
  --category=<value>      [default: general] Category of the conversation; use the 'conversation categories' command to
                          list available categories
  --editor=<value>        [default: vim] The editor to use when opening the message for editing; will respect your
                          EDITOR environment variable, and fall back on 'vim' if that is not set.
  --message=<value>       The body of the message to send; if neither this nor --message-from is given, an editor will
                          be opened to enter the message.
  --message-from=<value>  A file from which to read the message to send; may be '-' to read from stdin. If neither this
                          nor --message is given, an editor will be opened to enter the message.
  --title=<value>         (required) Title of the conversation

DESCRIPTION
  Create a new conversation
```

## `mw conversation list`

Get all conversation the authenticated user has created or has access to.

```
USAGE
  $ mw conversation list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  Get all conversation the authenticated user has created or has access to.
```

## `mw conversation reply ID`

Reply to a conversation

```
USAGE
  $ mw conversation reply ID [--message <value> | --message-from <value>] [--editor <value>]

ARGUMENTS
  ID  ID of the conversation to show

FLAGS
  --editor=<value>        [default: vim] The editor to use when opening the message for editing; will respect your
                          EDITOR environment variable, and fall back on 'vim' if that is not set.
  --message=<value>       The body of the message to send; if neither this nor --message-from is given, an editor will
                          be opened to enter the message.
  --message-from=<value>  A file from which to read the message to send; may be '-' to read from stdin. If neither this
                          nor --message is given, an editor will be opened to enter the message.

DESCRIPTION
  Reply to a conversation
```

## `mw conversation show ID`

Show a conversation and message history

```
USAGE
  $ mw conversation show ID

ARGUMENTS
  ID  ID of the conversation to show

DESCRIPTION
  Show a conversation and message history
```

## `mw conversation show2 CONVERSATIONID`

```
USAGE
  $ mw conversation show2 CONVERSATIONID [--wait]

FLAGS
  --wait
```

## `mw customer getCustomer CUSTOMERID`

Get a customer profile.

```
USAGE
  $ mw customer getCustomer CUSTOMERID [--output json|yaml |  | ]

ARGUMENTS
  CUSTOMERID  undefined

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a customer profile.
```

## `mw customer getCustomerCategory CATEGORYID`

Get a customer category.

```
USAGE
  $ mw customer getCustomerCategory CATEGORYID [--output json|yaml |  | ]

ARGUMENTS
  CATEGORYID  undefined

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a customer category.
```

## `mw customer getCustomerInvite INVITEID`

Get a CustomerInvite.

```
USAGE
  $ mw customer getCustomerInvite INVITEID [--output json|yaml |  | ]

ARGUMENTS
  INVITEID  ID of the CustomerInvite to be retrieved.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a CustomerInvite.
```

## `mw customer getCustomerMembership MEMBERSHIPID`

Get a CustomerMembership.

```
USAGE
  $ mw customer getCustomerMembership MEMBERSHIPID [--output json|yaml |  | ]

ARGUMENTS
  MEMBERSHIPID  ID of the CustomerMembership to retrieve.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a CustomerMembership.
```

## `mw customer getCustomerTokenInvite`

Get a CustomerInvite by token.

```
USAGE
  $ mw customer getCustomerTokenInvite [--output json|yaml |  | ]

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a CustomerInvite by token.
```

## `mw customer isCustomerLegallyCompetent`

Check if the customer profile has a valid contract partner configured.

```
USAGE
  $ mw customer isCustomerLegallyCompetent --customer-id <value> [--output json|yaml |  | ]

FLAGS
  --customer-id=<value>  (required) undefined
  --output=<option>      output in a more machine friendly format
                         <options: json|yaml>

DESCRIPTION
  Check if the customer profile has a valid contract partner configured.
```

## `mw customer listCustomerInvites`

List all CustomerInvites for the executing user.

```
USAGE
  $ mw customer listCustomerInvites [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List all CustomerInvites for the executing user.
```

## `mw customer listCustomerMemberships`

List all CustomerMemberships for the executing user.

```
USAGE
  $ mw customer listCustomerMemberships [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List all CustomerMemberships for the executing user.
```

## `mw customer listCustomers`

Get all customer profiles the authenticated user has access to.

```
USAGE
  $ mw customer listCustomers [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  Get all customer profiles the authenticated user has access to.
```

## `mw customer listInvitesForCustomer`

List all invites for a Customer.

```
USAGE
  $ mw customer listInvitesForCustomer --customer-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --customer-id=<value>  (required) ID of the Customer to list invites for.
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --sort=<value>         property to sort by (prepend '-' for descending)

DESCRIPTION
  List all invites for a Customer.
```

## `mw customer listMembershipsForCustomer`

List all memberships belonging to a Customer.

```
USAGE
  $ mw customer listMembershipsForCustomer --customer-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --customer-id=<value>  (required) Customer to list memberships for.
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --sort=<value>         property to sort by (prepend '-' for descending)

DESCRIPTION
  List all memberships belonging to a Customer.
```

## `mw customer listOfCustomerCategories`

Get all customer categories.

```
USAGE
  $ mw customer listOfCustomerCategories [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  Get all customer categories.
```

## `mw database mysql charsets`

List available MySQL character sets and collations, optionally filtered by a MySQLVersion.

```
USAGE
  $ mw database mysql charsets [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List available MySQL character sets and collations, optionally filtered by a MySQLVersion.
```

## `mw database mysql get ID`

Get a MySQLDatabase.

```
USAGE
  $ mw database mysql get ID [--output json|yaml |  | ]

ARGUMENTS
  ID  ID of the MySQLDatabase to be retrieved.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a MySQLDatabase.
```

## `mw database mysql list`

List MySQLDatabases belonging to a Project.

```
USAGE
  $ mw database mysql list --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) ID of the Project to list MySQLDatabases for.
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  List MySQLDatabases belonging to a Project.
```

## `mw database mysql user get ID`

Get a MySQLUser.

```
USAGE
  $ mw database mysql user get ID [--output json|yaml |  | ]

ARGUMENTS
  ID  ID of the MySQLUser to be retrieved.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a MySQLUser.
```

## `mw database mysql user getMysqlUserPhpMyAdminUrl`

Get a MySQLUser's PhpMyAdmin-URL.

```
USAGE
  $ mw database mysql user getMysqlUserPhpMyAdminUrl --id <value> [--output json|yaml |  | ]

FLAGS
  --id=<value>       (required) ID of the MySQLUser for which to get the URL for.
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a MySQLUser's PhpMyAdmin-URL.
```

## `mw database mysql user list`

List MySQLUsers belonging to a database.

```
USAGE
  $ mw database mysql user list --database-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended         show extra columns
  --columns=<value>      only show provided columns (comma-separated)
  --csv                  output is csv format [alias: --output=csv]
  --database-id=<value>  (required) ID of the MySQLDatabase to list Users for.
  --filter=<value>       filter property by partial string matching, ex: name=foo
  --no-header            hide table header from output
  --no-truncate          do not truncate output to fit screen
  --output=<option>      output in a more machine friendly format
                         <options: csv|json|yaml>
  --sort=<value>         property to sort by (prepend '-' for descending)

DESCRIPTION
  List MySQLUsers belonging to a database.
```

## `mw database mysql versions`

List available MySQLVersions.

```
USAGE
  $ mw database mysql versions [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List available MySQLVersions.
```

## `mw database redis get ID`

Get a RedisDatabase.

```
USAGE
  $ mw database redis get ID [--output json|yaml |  | ]

ARGUMENTS
  ID  ID of the RedisDatabase to retrieve.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a RedisDatabase.
```

## `mw database redis list`

List RedisDatabases belonging to a project.

```
USAGE
  $ mw database redis list --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) ID of the Project to list RedisDatabases for.
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  List RedisDatabases belonging to a project.
```

## `mw database redis versions`

List available Redis versions.

```
USAGE
  $ mw database redis versions [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List available Redis versions.
```

## `mw domain dnsZoneGetSpecific ZONEID`

gets a specific zone

```
USAGE
  $ mw domain dnsZoneGetSpecific ZONEID [--output json|yaml |  | ]

ARGUMENTS
  ZONEID  id of the zone you want to get

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  gets a specific zone
```

## `mw domain dnsZonesForProject`

gets all dns zones by project id

```
USAGE
  $ mw domain dnsZonesForProject --project-id <value> [--output json|yaml |  | ]

FLAGS
  --output=<option>     output in a more machine friendly format
                        <options: json|yaml>
  --project-id=<value>  (required) project you want to get the zones for

DESCRIPTION
  gets all dns zones by project id
```

## `mw domain get DOMAINID`

Get a Domain.

```
USAGE
  $ mw domain get DOMAINID [--output json|yaml |  | ]

ARGUMENTS
  DOMAINID  undefined

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a Domain.
```

## `mw domain getHandleFields DOMAINNAME`

Get a HandleSchema.

```
USAGE
  $ mw domain getHandleFields DOMAINNAME [--output json|yaml |  | ]

ARGUMENTS
  DOMAINNAME  The whole domain name

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a HandleSchema.
```

## `mw domain getSpecificDomainOwnership DOMAINOWNERSHIPID`

Get a domain ownership.

```
USAGE
  $ mw domain getSpecificDomainOwnership DOMAINOWNERSHIPID [--output json|yaml |  | ]

ARGUMENTS
  DOMAINOWNERSHIPID  undefined

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a domain ownership.
```

## `mw domain list`

List Domains belonging to a Project.

```
USAGE
  $ mw domain list --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) undefined
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  List Domains belonging to a Project.
```

## `mw domain listDomainOwnerships`

List all domain ownerships of a project.

```
USAGE
  $ mw domain listDomainOwnerships --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) undefined
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  List all domain ownerships of a project.
```

## `mw domain tld get TLD`

Get a toplevel domain.

```
USAGE
  $ mw domain tld get TLD [--output json|yaml |  | ]

ARGUMENTS
  TLD  undefined

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a toplevel domain.
```

## `mw domain tld list`

List all supported toplevel domains.

```
USAGE
  $ mw domain tld list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List all supported toplevel domains.
```

## `mw domain virtualhost get INGRESSID`

Get an Ingress.

```
USAGE
  $ mw domain virtualhost get INGRESSID [--output json|yaml |  | ]

ARGUMENTS
  INGRESSID  ID of the Ingress to be retrieved.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get an Ingress.
```

## `mw domain virtualhost list`

List Ingresses the user has access to.

```
USAGE
  $ mw domain virtualhost list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ] [--project-id <value>]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  Project ID to filter by; if omitted this will list virtual hosts in all projects you have access
                        to.
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  List Ingresses the user has access to.
```

## `mw help [COMMANDS]`

Display help for mw.

```
USAGE
  $ mw help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for mw.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.11/src/commands/help.ts)_

## `mw login status`

Checks your current authentication status

```
USAGE
  $ mw login status

DESCRIPTION
  Checks your current authentication status
```

## `mw login token`

Authenticate using an API token

```
USAGE
  $ mw login token [-o]

FLAGS
  -o, --overwrite  overwrite existing token file

DESCRIPTION
  Authenticate using an API token
```

## `mw mail address create`

Create a new mail address

```
USAGE
  $ mw mail address create -p <value> -a <value> [--catch-all] [--enable-spam-protection] [--quota <value>]

FLAGS
  -a, --address=<value>          (required) Mail address
  -p, --projectId=<value>        (required) Project ID or short ID
  --catch-all                    Make this a catch-all mail address
  --[no-]enable-spam-protection  Enable spam protection for this mailbox
  --quota=<value>                [default: 1024] Mailbox quota in mebibytes

DESCRIPTION
  Create a new mail address
```

## `mw mail address delete ID`

Delete a mail address

```
USAGE
  $ mw mail address delete ID [--force]

ARGUMENTS
  ID  Mail address ID

FLAGS
  --force  Do not ask for confirmation

DESCRIPTION
  Delete a mail address
```

## `mw mail address get ID`

Get a specific mail address

```
USAGE
  $ mw mail address get ID [--output json|yaml |  | ]

ARGUMENTS
  ID  id of the address you want to get

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a specific mail address
```

## `mw mail address list`

Get all mail addresses for a project ID

```
USAGE
  $ mw mail address list --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) Project ID the mailAddresses are related to
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  Get all mail addresses for a project ID
```

## `mw mail deliverybox get ID`

Get a specific deliverybox

```
USAGE
  $ mw mail deliverybox get ID [--output json|yaml |  | ]

ARGUMENTS
  ID  ID of the deliverybox you want to retrieve

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a specific deliverybox
```

## `mw mail deliverybox list`

Get all deliveryboxes by project ID

```
USAGE
  $ mw mail deliverybox list --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) Project ID the deliveryboxes are related to
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  Get all deliveryboxes by project ID
```

## `mw project backup get PROJECTBACKUPID`

Get a ProjectBackup.

```
USAGE
  $ mw project backup get PROJECTBACKUPID [--output json|yaml |  | ]

ARGUMENTS
  PROJECTBACKUPID  ID of the ProjectBackup to retrieve.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a ProjectBackup.
```

## `mw project backup list`

List Backups for a given Project.

```
USAGE
  $ mw project backup list --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) ID of the Project to get Backups for.
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  List Backups for a given Project.
```

## `mw project backupschedule get PROJECTBACKUPSCHEDULEID`

Get a ProjectBackupSchedule.

```
USAGE
  $ mw project backupschedule get PROJECTBACKUPSCHEDULEID [--output json|yaml |  | ]

ARGUMENTS
  PROJECTBACKUPSCHEDULEID  ID of the ProjectBackupSchedule to retrieve.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a ProjectBackupSchedule.
```

## `mw project backupschedule list`

List BackupSchedules belonging to a given Project.

```
USAGE
  $ mw project backupschedule list --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) ID of the Project to list BackupSchedules for.
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  List BackupSchedules belonging to a given Project.
```

## `mw project create`

Get the details of a project

```
USAGE
  $ mw project create -s <value> -d <value> [-w]

FLAGS
  -d, --description=<value>  (required) A description for the project.
  -s, --server-id=<value>    (required) ID of the Server, in which the project is to be created.
  -w, --wait                 Wait for the project to be ready.

DESCRIPTION
  Get the details of a project
```

## `mw project cronjob execution get EXECUTIONID`

Get a CronjobExecution.

```
USAGE
  $ mw project cronjob execution get EXECUTIONID --cronjob-id <value> [--output json|yaml |  | ]

ARGUMENTS
  EXECUTIONID  ID of the CronjobExecution to be retrieved.

FLAGS
  --cronjob-id=<value>  (required) undefined
  --output=<option>     output in a more machine friendly format
                        <options: json|yaml>

DESCRIPTION
  Get a CronjobExecution.
```

## `mw project cronjob execution list`

List CronjobExecutions belonging to a Cronjob.

```
USAGE
  $ mw project cronjob execution list --cronjob-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --cronjob-id=<value>  (required) ID of the Cronjob for which to list CronjobExecutions for.
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  List CronjobExecutions belonging to a Cronjob.
```

## `mw project cronjob get CRONJOBID`

Get a Cronjob.

```
USAGE
  $ mw project cronjob get CRONJOBID [--output json|yaml |  | ]

ARGUMENTS
  CRONJOBID  ID of the Cronjob to be retrieved.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a Cronjob.
```

## `mw project cronjob list`

List Cronjobs belonging to a Project.

```
USAGE
  $ mw project cronjob list --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) ID of the Project for which to list Cronjobs for.
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  List Cronjobs belonging to a Project.
```

## `mw project delete ID`

Delete a project

```
USAGE
  $ mw project delete ID [--force]

ARGUMENTS
  ID  ID of the Project to be deleted.

FLAGS
  --force  Do not ask for confirmation

DESCRIPTION
  Delete a project
```

## `mw project filesystem directories`

List the directories of a Project.

```
USAGE
  $ mw project filesystem directories --project-id <value> [--output json|yaml |  | ]

FLAGS
  --output=<option>     output in a more machine friendly format
                        <options: json|yaml>
  --project-id=<value>  (required) ID of the Project to list the directories for.

DESCRIPTION
  List the directories of a Project.
```

## `mw project filesystem file-content`

Get a Project file's content.

```
USAGE
  $ mw project filesystem file-content --project-id <value> [--output json|yaml |  | ]

FLAGS
  --output=<option>     output in a more machine friendly format
                        <options: json|yaml>
  --project-id=<value>  (required) ID of the Project.

DESCRIPTION
  Get a Project file's content.
```

## `mw project filesystem files PROJECTID`

Get a foooooooo.

```
USAGE
  $ mw project filesystem files PROJECTID [--output json|yaml |  | ]

ARGUMENTS
  PROJECTID  ID of the Project.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a foooooooo.
```

## `mw project filesystem usage`

Get a Project directory filesystem usage.

```
USAGE
  $ mw project filesystem usage --project-id <value> [--output json|yaml |  | ]

FLAGS
  --output=<option>     output in a more machine friendly format
                        <options: json|yaml>
  --project-id=<value>  (required) ID of the Project.

DESCRIPTION
  Get a Project directory filesystem usage.
```

## `mw project get ID`

Get a Project.

```
USAGE
  $ mw project get ID [--output json|yaml |  | ]

ARGUMENTS
  ID  ID of the Project to be retrieved.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a Project.
```

## `mw project invite get INVITEID`

Get a ProjectInvite.

```
USAGE
  $ mw project invite get INVITEID [--output json|yaml |  | ]

ARGUMENTS
  INVITEID  ID of the ProjectInvite to be retrieved.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a ProjectInvite.
```

## `mw project invite list`

List all invites belonging to a Project.

```
USAGE
  $ mw project invite list --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) ID of the Project to list invites for.
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  List all invites belonging to a Project.
```

## `mw project invite list-own`

List all ProjectInvites for the executing user.

```
USAGE
  $ mw project invite list-own [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List all ProjectInvites for the executing user.
```

## `mw project list`

List Project's for an Organization or Server.

```
USAGE
  $ mw project list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List Project's for an Organization or Server.
```

## `mw project list1`

```
USAGE
  $ mw project list1 [--columns <value>]

FLAGS
  --columns=<value>...
```

## `mw project list2`

```
USAGE
  $ mw project list2 [--wait] [--columns <value>]

FLAGS
  --columns=<value>...
  --wait
```

## `mw project membership get MEMBERSHIPID`

Get a ProjectMembership

```
USAGE
  $ mw project membership get MEMBERSHIPID [--output json|yaml |  | ]

ARGUMENTS
  MEMBERSHIPID  ID of the ProjectMembership to be retrieved.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a ProjectMembership
```

## `mw project membership get-own`

Get the executing user's membership in a Project.

```
USAGE
  $ mw project membership get-own --project-id <value> [--output json|yaml |  | ]

FLAGS
  --output=<option>     output in a more machine friendly format
                        <options: json|yaml>
  --project-id=<value>  (required) ID of the Project to get the membership for.

DESCRIPTION
  Get the executing user's membership in a Project.
```

## `mw project membership list`

List all memberships for a Project.

```
USAGE
  $ mw project membership list --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) ID of the Project to list memberships for.
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  List all memberships for a Project.
```

## `mw project membership list-own`

List ProjectMemberships belonging to the executing user.

```
USAGE
  $ mw project membership list-own [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List ProjectMemberships belonging to the executing user.
```

## `mw project sftp-user list`

Get all SFTPUsers for a Project.

```
USAGE
  $ mw project sftp-user list --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) ID of the Project to request SFTPUsers for.
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  Get all SFTPUsers for a Project.
```

## `mw project ssh ID`

Connect to a project via SSH

```
USAGE
  $ mw project ssh ID

ARGUMENTS
  ID  ID of the Project to be retrieved.

DESCRIPTION
  Connect to a project via SSH
```

## `mw project ssh-user list`

Get all SSHUsers for a Project.

```
USAGE
  $ mw project ssh-user list --project-id <value> [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended        show extra columns
  --columns=<value>     only show provided columns (comma-separated)
  --csv                 output is csv format [alias: --output=csv]
  --filter=<value>      filter property by partial string matching, ex: name=foo
  --no-header           hide table header from output
  --no-truncate         do not truncate output to fit screen
  --output=<option>     output in a more machine friendly format
                        <options: csv|json|yaml>
  --project-id=<value>  (required) ID of the Project to retrieve SSHUsers for.
  --sort=<value>        property to sort by (prepend '-' for descending)

DESCRIPTION
  Get all SSHUsers for a Project.
```

## `mw project update ID`

Updates a project

```
USAGE
  $ mw project update ID

ARGUMENTS
  ID  ID of the Project to be retrieved.

DESCRIPTION
  Updates a project
```

## `mw server get SERVERID`

Get a Server.

```
USAGE
  $ mw server get SERVERID [--output json|yaml |  | ]

ARGUMENTS
  SERVERID  ID of the Server to be retrieved.

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a Server.
```

## `mw server list`

List Servers for an Organization or User.

```
USAGE
  $ mw server list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List Servers for an Organization or User.
```

## `mw user api-token create`

Create a new API token

```
USAGE
  $ mw user api-token create --description <value> --roles api_read|api_write [--expires-in <value>]

FLAGS
  --description=<value>  (required) Description of the API token
  --expires-in=<value>   Expiration interval of the API token (example: 30d)
  --roles=<option>...    (required) Roles of the API token
                         <options: api_read|api_write>

DESCRIPTION
  Create a new API token
```

## `mw user api-token get APITOKENID`

Get a specific ApiToken

```
USAGE
  $ mw user api-token get APITOKENID [--output json|yaml |  | ]

ARGUMENTS
  APITOKENID  The uuid of an ApiToken

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a specific ApiToken
```

## `mw user api-token list`

List all ApiTokens of the user

```
USAGE
  $ mw user api-token list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List all ApiTokens of the user
```

## `mw user api-token revoke ID`

Revoke an API token

```
USAGE
  $ mw user api-token revoke ID

ARGUMENTS
  ID  ID of the API token to revoke

DESCRIPTION
  Revoke an API token
```

## `mw user get`

Get profile information for a user.

```
USAGE
  $ mw user get [--output json|yaml |  | ]

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get profile information for a user.
```

## `mw user session get TOKENID`

Get a specific Session

```
USAGE
  $ mw user session get TOKENID [--output json|yaml |  | ]

ARGUMENTS
  TOKENID  tokenId to identify the concrete Session

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a specific Session
```

## `mw user session list`

List all active sessions

```
USAGE
  $ mw user session list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List all active sessions
```

## `mw user ssh-key create`

Create and import a new SSH key

```
USAGE
  $ mw user ssh-key create [--no-passphrase] [--comment <value>] [--expiresAt <value>]

FLAGS
  --comment=<value>    A comment for the SSH key.
  --expiresAt=<value>  Duration after which the SSH key should expire (example: '1y').
  --no-passphrase      Use this flag to not set a passphrase for the SSH key.

DESCRIPTION
  Create and import a new SSH key
```

## `mw user ssh-key delete ID`

Delete an SSH key

```
USAGE
  $ mw user ssh-key delete ID [-f]

ARGUMENTS
  ID  ID of the SSH key to be deleted.

FLAGS
  -f, --force  delete without prompting for confirmation

DESCRIPTION
  Delete an SSH key
```

## `mw user ssh-key get SSHKEYID`

Get a specific stored SshKey

```
USAGE
  $ mw user ssh-key get SSHKEYID [--output json|yaml |  | ]

ARGUMENTS
  SSHKEYID  undefined

FLAGS
  --output=<option>  output in a more machine friendly format
                     <options: json|yaml>

DESCRIPTION
  Get a specific stored SshKey
```

## `mw user ssh-key list`

Get your stored ssh keys

```
USAGE
  $ mw user ssh-key list [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  Get your stored ssh keys
```
<!-- commandsstop -->
