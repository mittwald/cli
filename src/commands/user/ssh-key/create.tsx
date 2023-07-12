import { Flags, ux } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import * as cp from "child_process";
import * as path from "path";
import * as os from "os";
import * as fs from "fs/promises";
import parseDuration from "parse-duration";
import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/react/process_flags.js";
import { Success } from "../../../rendering/react/components/Success.js";
import { Filename } from "../../../rendering/react/components/Filename.js";
import { Text } from "ink";

export default class Create extends ExecRenderBaseCommand<typeof Create, {}> {
  static description = "Create and import a new SSH key";

  static flags = {
    ...processFlags,
    output: Flags.string({
      description: "A filename in your ~/.ssh directory to write the SSH key to.",
      default: "mstudio-cli",
    }),
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

  protected async exec(): Promise<{}> {
    const { flags } = await this.parse(Create);
    const cmd = "ssh-keygen";
    const outputFile = path.join(os.homedir(), ".ssh", flags.output);
    const args = ["-t", "rsa", "-f", outputFile];

    const process = makeProcessRenderer(flags, "Creating a new SSH key");

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
      const passphrase = await process.addInput(<Text>enter passphrase for SSH key</Text>, true);
      args.push("-N", passphrase);
    }

    if (flags.comment) {
      args.push("-C", flags.comment);
    }

    const publicKey = await process.runStep(
      "generating SSH key using ssh-keygen",
      async () => {
        cp.spawnSync(cmd, args, { stdio: "ignore" });
        return await fs.readFile(outputFile + ".pub", "utf-8");
      },
    );

    process.addInfo(<Text>ssh key saved to <Filename filename={outputFile} />.</Text>)

    await process.runStep("importing SSH key", async () => {
      const response = await this.apiClient.user.createSshKey({
        data: {
          publicKey,
          expiresAt: expiresAt?.toJSON(),
        },
      });

      assertStatus(response, 201);
      return response;
    });

    process.complete(
      <Success>
        Your SSH key was successfully created and imported to your user profile.
      </Success>,
    );

    return {};
  }

  protected render(executionResult: {}): ReactNode {
    return undefined;
  }
}
