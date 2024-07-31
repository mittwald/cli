/**
 * Re-usable documentation string for commands that establish an interactive SSH
 * session.
 */
export const sshWrapperDocumentation =
  "This command is a wrapper around your systems SSH client, and will respect your SSH configuration in ~/.ssh/config.\n\n" +
  "An exception to this is the 'User' configuration, which will be overridden by this command to either your authenticated mStudio user or the user specified with the --ssh-user flag.\n\n" +
  "See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.";

/**
 * Re-usable documentation string for commands that rely on SSH connections, but
 * in which the SSH connection itself is not the primary feature.
 */
export const sshUsageDocumentation =
  "This command relies on connecting to your hosting environment via SSH. For this, it will use your systems SSH client under the hood, and will respect your SSH configuration in ~/.ssh/config.\n\n" +
  "An exception to this is the 'User' configuration, which will be overridden by this command to either your authenticated mStudio user or the user specified with the --ssh-user flag.\n\n" +
  "See https://linux.die.net/man/5/ssh_config for a reference on the configuration file.";
