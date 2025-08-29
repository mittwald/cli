import { Hook } from "@oclif/core";
import { execSync } from "child_process";

const hook: Hook<"prerun"> = async function (opts) {
  const isInstalledWithBrew = () => {
    try {
      const cellar = execSync("brew --cellar", { encoding: "utf8" });
      return opts.config.root.startsWith(cellar.trim());
    } catch {
      return false;
    }
  };

  if (opts.Command.id === "update") {
    if (isInstalledWithBrew()) {
      opts.context.warn(
        "installed with brew.\nUse `brew upgrade mw` to update to the newest version",
      );
      opts.context.exit(1);
    }
  }
};

export default hook;
