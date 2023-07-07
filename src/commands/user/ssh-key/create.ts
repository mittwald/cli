import { Flags, ux } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { BaseCommand } from "../../../BaseCommand.js";
import * as cp from "child_process";
import * as path from "path";
import * as os from "os";
import * as fs from "fs/promises";
import parseDuration from "parse-duration";

export default class Create extends BaseCommand<typeof Create> {
  static description = "Create and import a new SSH key";

  static flags = {
    "no-passphrase": Flags.boolean({
      description: "Use this flag to not set a passphrase for the SSH key.",
    }),
    comment: Flags.string({
      description: "A comment for the SSH key.",
    }),
    expiresAt: Flags.string({
      description:
        "Duration after which the SSH key should expire (example: '1y').",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Create);

    const cmd = "ssh-keygen";
    const outputFile = path.join(os.homedir(), ".ssh", "mstudio-cli");
    const args = ["-t", "rsa", "-f", outputFile];

    let expiresAt: Date | undefined;

    if (flags["expiresAt"]) {
      const parsedDuration = parseDuration(flags["expiresAt"]);
      if (!parsedDuration) {
        throw new Error("Invalid duration");
      }

      expiresAt = new Date();
      expiresAt.setTime(new Date().getTime() + parsedDuration);
    }

    if (flags["no-passphrase"]) {
      args.push("-N", "");
    } else {
      const passphrase = await ux.prompt("enter passphrase for SSH key", {
        type: "hide",
      });
      args.push("-N", passphrase);
    }

    if (flags.comment) {
      args.push("-C", flags.comment);
    }

    cp.spawnSync(cmd, args, { stdio: "inherit" });

    const publicKey = await fs.readFile(outputFile + ".pub", "utf-8");

    ux.action.start("importing SSH key");

    const response = await this.apiClient.user.createSshKey({
      data: {
        publicKey,
        expiresAt: expiresAt?.toJSON(),
      },
    });

    assertStatus(response, 201);

    ux.action.stop();
  }
}
