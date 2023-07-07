import { Flags } from "@oclif/core";
import * as fs from "fs";
import * as cp from "child_process";
import tempfile from "tempfile";

export const messageFlags = {
  message: Flags.string({
    description:
      "The body of the message to send; if neither this nor --message-from is given, an editor will be opened to enter the message.",
    exclusive: ["message-from"],
  }),
  "message-from": Flags.string({
    description:
      "A file from which to read the message to send; may be '-' to read from stdin. If neither this nor --message is given, an editor will be opened to enter the message.",
    exclusive: ["message"],
  }),
  editor: Flags.string({
    description:
      "The editor to use when opening the message for editing; will respect your EDITOR environment variable, and fall back on 'vim' if that is not set.",
    default: process.env.EDITOR || "vim",
  }),
};

export async function retrieveMessage(flags: {
  message?: string;
  "message-from"?: string;
  editor: string;
}): Promise<string | undefined> {
  if (flags.message) {
    return flags.message;
  }

  if (flags["message-from"]) {
    if (flags["message-from"] === "-") {
      // Needs to be "readFileSync" because (according to the typings, at least)
      // only that supports reading directly from an open file descriptor.
      // Ding, ding.
      return fs.readFileSync(process.stdin.fd, "utf-8");
    }
    return fs.readFileSync(flags["message-from"], "utf-8");
  }

  return retrieveMessageFromEditor(flags.editor);
}

async function retrieveMessageFromEditor(
  editor: string,
): Promise<string | undefined> {
  const tmp = tempfile({ extension: ".md" });

  try {
    let args = [tmp];

    if (editor === "vim") {
      args = ["-c", "syntax on", "-c", "set filetype=markdown", ...args];
    }

    cp.spawnSync(editor, args, {
      stdio: "inherit",
    });

    return fs.readFileSync(tmp, "utf-8");
  } finally {
    fs.unlinkSync(tmp);
  }
}
