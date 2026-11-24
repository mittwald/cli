/** Public API of the mittwald CLI for plugins: common flags and arguments. */

// ID flags and arguments of resources, with a function that determines the
// resource ID from the flags/arguments or the context
export {
  appInstallationArgs,
  appInstallationFlags,
  withAppInstallationId,
} from "../lib/resources/app/flags.js";
export {
  backupArgs,
  backupFlags,
  withBackupId,
} from "../lib/resources/backup/flags.js";
export {
  containerArgs,
  containerFlags,
  withContainerId,
} from "../lib/resources/container/flags.js";
export {
  conversationArgs,
  conversationFlags,
  withConversationId,
} from "../lib/resources/conversation/flags.js";
export {
  domainArgs,
  domainFlags,
  withDomainId,
} from "../lib/resources/domain/flags.js";
export {
  dnsZoneArgs,
  dnsZoneFlags,
  withDnsZoneId,
} from "../lib/resources/domain/dnszone/flags.js";
export {
  mailAddressArgs,
  mailAddressFlags,
  mailDeliveryBoxArgs,
  mailDeliveryBoxFlags,
  withDeliveryBoxId,
  withMailAddressId,
} from "../lib/resources/mail/flags.js";
export { orgArgs, orgFlags, withOrgId } from "../lib/resources/org/flags.js";
export {
  projectArgs,
  projectFlags,
  withProjectId,
} from "../lib/resources/project/flags.js";
export {
  serverArgs,
  serverFlags,
  withServerId,
} from "../lib/resources/server/flags.js";
export {
  stackArgs,
  stackFlags,
  withStackId,
} from "../lib/resources/stack/flags.js";

// Behaviour and output
export { waitFlags, waitUntil, type WaitFlags } from "../lib/wait.js";
export {
  processFlags,
  type ProcessFlags,
} from "../rendering/process/process_flags.js";
export { expireFlags } from "../lib/flags/expireFlags.js";

// SSH connections
export {
  sshConnectionFlags,
  type SSHConnectionFlags,
} from "../lib/resources/ssh/flags.js";

// Container configuration
export {
  containerDescriptionFlag,
  containerEntrypointFlag,
  containerEnvFileFlag,
  containerEnvFlag,
  containerPublishAllFlag,
  containerPublishFlag,
  containerVolumeFlag,
  containerVolumeFormatDescription,
} from "../lib/resources/container/common-flags.js";
