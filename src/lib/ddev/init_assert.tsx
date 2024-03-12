import { ProcessRenderer } from "../../rendering/process/process.js";
import { hasBinary } from "../hasbin.js";
import React from "react";
import { promisify } from "util";
import { exec } from "child_process";
import { Value } from "../../rendering/react/components/Value.js";

const execAsync = promisify(exec);

export async function assertDDEVIsInstalled(r: ProcessRenderer): Promise<void> {
  await r.runStep("check if DDEV is installed", async () => {
    if (!(await hasBinary("ddev"))) {
      throw new Error("this command requires DDEV to be installed");
    }
  });
}

export async function determineDDEVVersion(
  r: ProcessRenderer,
): Promise<string> {
  const { stdout } = await execAsync("ddev --version");
  const version = stdout.trim().replace(/^ddev version +/, "");

  r.addInfo(<InfoDDEVVersion version={version} />);

  return version;
}

function InfoDDEVVersion({ version }: { version: string }) {
  return (
    <>
      detected DDEV version: <Value>{version}</Value>
    </>
  );
}
