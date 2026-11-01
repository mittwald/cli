import { describe, expect, it } from "@jest/globals";
import { buildScpArgs } from "./scp.js";

const knownHostsFlags = ["-o", "GlobalKnownHostsFile=/tmp/mw/known_hosts"];
const connectionArgs = [...knownHostsFlags, "-o", "PasswordAuthentication=no"];

const identityFile = "/home/user/.ssh/id_ed25519";
const remote = "user@host.container.internal:/app/data";
const local = "./backup";

describe("buildScpArgs", () => {
  it("passes the identity file to scp before the paths", () => {
    const args = buildScpArgs(knownHostsFlags, remote, local, {
      "ssh-identity-file": identityFile,
    });

    expect(args).toEqual([
      ...connectionArgs,
      "-i",
      identityFile,
      remote,
      local,
    ]);
  });

  it("keeps identity file paths containing spaces as one argument", () => {
    const pathWithSpaces = "/home/user/keys/my key";
    const args = buildScpArgs(knownHostsFlags, remote, local, {
      "ssh-identity-file": pathWithSpaces,
    });

    expect(args.indexOf("-i")).toBe(connectionArgs.length);
    expect(args[connectionArgs.length + 1]).toBe(pathWithSpaces);
    expect(args).toHaveLength(connectionArgs.length + 4);
  });

  it("omits the identity file option when none is configured", () => {
    const args = buildScpArgs(knownHostsFlags, remote, local, {});

    expect(args).toEqual([...connectionArgs, remote, local]);
    expect(args).not.toContain("-i");
  });

  it("maps archive and recursive to -p and -r", () => {
    const args = buildScpArgs(knownHostsFlags, remote, local, {
      archive: true,
      recursive: true,
    });

    expect(args).toEqual([...connectionArgs, "-p", "-r", remote, local]);
  });

  it("keeps archive and recursive flags behind the identity file option", () => {
    const args = buildScpArgs(knownHostsFlags, remote, local, {
      archive: true,
      recursive: true,
      "ssh-identity-file": identityFile,
    });

    expect(args).toEqual([
      ...connectionArgs,
      "-i",
      identityFile,
      "-p",
      "-r",
      remote,
      local,
    ]);
  });
});
