import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import * as path from "path";
import * as os from "os";
import * as fs from "fs/promises";
import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Success } from "../../../rendering/react/components/Success.js";
import { Filename } from "../../../rendering/react/components/Filename.js";
import { Text } from "ink";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import { spawnInProcess } from "../../../rendering/process/process_exec.js";
import { expireFlags } from "../../../lib/flags/expireFlags.js";

export default class Create extends ExecRenderBaseCommand<
  typeof Create,
  undefined
> {
  static description = "Create and import a new SSH key";

  static flags = {
    ...processFlags,
    ...expireFlags("SSH key", false),
    output: Flags.string({
      description:
        "A filename in your ~/.ssh directory to write the SSH key to.",
      default: "mstudio-cli",
    }),
    "no-passphrase": Flags.boolean({
      description: "Use this flag to not set a passphrase for the SSH key.",
    }),
    comment: Flags.string({
      description: "A comment for the SSH key.",
    }),
  };

  protected async exec(): Promise<undefined> {
    const cmd = "ssh-keygen";
    const outputFile = path.join(os.homedir(), ".ssh", this.flags.output);

    const r = makeProcessRenderer(this.flags, "Creating a new SSH key");

    const { expires } = this.flags;
    const passphrase = await this.getPassphrase(r);
    const args = ["-t", "rsa", "-f", outputFile, "-N", passphrase];

    if (this.flags.comment) {
      args.push("-C", this.flags.comment);
    }

    await spawnInProcess(r, "generating SSH key using ssh-keygen", cmd, args);
    const publicKey = await fs.readFile(outputFile + ".pub", "utf-8");

    r.addInfo(<InfoSSHKeySaved filename={outputFile} />);

    await r.runStep("importing SSH key", async () => {
      const response = await this.apiClient.user.createSshKey({
        data: {
          publicKey,
          expiresAt: expires?.toJSON(),
        },
      });

      assertStatus(response, 201);
    });

    await r.complete(<SSHKeySuccess />);
  }

  protected render() {
    return null;
  }

  private async getPassphrase(r: ProcessRenderer): Promise<string> {
    if (this.flags["no-passphrase"]) {
      return "";
    }

    return await r.addInput(<Text>enter passphrase for SSH key</Text>, true);
  }
}

function SSHKeySuccess() {
  return (
    <Success>
      Your SSH key was successfully created and imported to your user profile.
    </Success>
  );
}

function InfoSSHKeySaved({ filename }: { filename: string }) {
  return (
    <Text>
      ssh key saved to <Filename filename={filename} />.
    </Text>
  );
}
