/** Public API of the mittwald CLI for plugins: common flags and arguments. */

export {
  projectArgs,
  projectFlags,
  withProjectId,
} from "../lib/resources/project/flags.js";
export { orgArgs, orgFlags, withOrgId } from "../lib/resources/org/flags.js";
export {
  serverArgs,
  serverFlags,
  withServerId,
} from "../lib/resources/server/flags.js";
export { waitFlags, waitUntil, type WaitFlags } from "../lib/wait.js";
export {
  processFlags,
  type ProcessFlags,
} from "../rendering/process/process_flags.js";
export {
  containerEnvFileFlag,
  containerEnvFlag,
} from "../lib/resources/container/common-flags.js";
