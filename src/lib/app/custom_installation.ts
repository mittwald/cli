import { phpInstaller } from "../../commands/app/create/php.js";
import { nodeInstaller } from "../../commands/app/create/node.js";
import { pythonInstaller } from "../../commands/app/create/python.js";

/**
 * Tests if an app installation is for a custom app (for example, a custom PHP
 * or Node.js app). These are treated differently in the UI.
 *
 * @param appId
 */
export function isCustomAppInstallation(appId: string): boolean {
  return [
    phpInstaller.appId,
    nodeInstaller.appId,
    pythonInstaller.appId,
  ].includes(appId);
}
