export interface ScpArgsOptions {
  archive?: boolean;
  recursive?: boolean;
  "ssh-identity-file"?: string;
}

export function buildScpArgs(
  knownHostsFlags: string[],
  source: string,
  dest: string,
  flags: ScpArgsOptions,
): string[] {
  const args = [...knownHostsFlags, "-o", "PasswordAuthentication=no"];

  if (flags["ssh-identity-file"]) {
    args.push("-i", flags["ssh-identity-file"]);
  }

  if (flags.archive) {
    args.push("-p");
  }

  if (flags.recursive) {
    args.push("-r");
  }

  args.push(source, dest);
  return args;
}
