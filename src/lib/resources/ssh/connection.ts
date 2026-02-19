import { SSHConnectionFlags } from "./flags.js";
import { getSSHKnownHostsFlags } from "./knownhosts.js";

export interface SSHClientFlagOptions {
  /**
   * Whether you want an interactive connection; this will force the client to
   * (not) allocate a pseudo-terminal.
   */
  interactive: boolean;

  /** Additional flags to pass to the SSH client invocation. */
  additionalFlags: string[];

  /** The oclif config directory for storing the known_hosts file. */
  configDir: string;
}

/**
 * Builds the flags and arguments for an SSH client invocation.
 *
 * @param username The username to connect with
 * @param hostname The hostname to connect to
 * @param inputFlags The raw input flags concerning the SSH connection that came
 *   into the original command. NOTE: These are entirely unrelated to the actual
 *   flags of the "ssh" binary.
 * @param opts Additional (optional) options for the SSH client invocation.
 * @see https://linux.die.net/man/1/ssh
 */
export function buildSSHClientFlags(
  username: string,
  hostname: string,
  inputFlags: SSHConnectionFlags,
  opts: Partial<SSHClientFlagOptions> & Pick<SSHClientFlagOptions, "configDir">,
): string[] {
  const { interactive, additionalFlags = [], configDir } = opts;
  const flags = [
    ...getSSHKnownHostsFlags(configDir),
    "-l",
    username,
    interactive ? "-t" : "-T",
  ];

  if (inputFlags["ssh-identity-file"]) {
    flags.push("-i", inputFlags["ssh-identity-file"]);
  }

  return [...flags, ...additionalFlags, hostname];
}
