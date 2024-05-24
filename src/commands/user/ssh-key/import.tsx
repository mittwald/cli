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
import { expireFlags } from "../../../lib/expires.js";

export default class Import extends ExecRenderBaseCommand<
  typeof Import,
  undefined
> {
  static description = "Import an existing (local) SSH key";

  static flags = {
    ...processFlags,
    ...expireFlags("SSH key", false),
    input: Flags.string({
      description:
        "A filename in your ~/.ssh directory containing the key to import.",
      default: "id_rsa.pub",
    }),
  };

  protected async exec(): Promise<undefined> {
    const inputFile = path.join(os.homedir(), ".ssh", this.flags.input);

    const r = makeProcessRenderer(this.flags, "Importing an SSH key");

    const { expires } = this.flags;
    const publicKey = await fs.readFile(inputFile, "utf-8");
    const publicKeyParts = publicKey.split(" ");

    const keys = await r.runStep("retrieving existing SSH keys", async () => {
      const response = await this.apiClient.user.listSshKeys();
      assertStatus(response, 200);

      return response.data;
    });

    const keyAlreadyExists = (keys.sshKeys ?? []).some(({ key }) =>
      publicKeyParts.includes(key),
    );

    if (keyAlreadyExists) {
      r.addInfo(
        <>
          the SSH key <Filename filename={inputFile} /> is already imported.
        </>,
      );
      await r.complete(<SSHKeySuccess />);
      return;
    }

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
}

function SSHKeySuccess() {
  return (
    <Success>
      Your SSH key was successfully read and imported to your user profile.
    </Success>
  );
}
