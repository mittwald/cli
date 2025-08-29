import shellEscape from "shell-escape";

/**
 * Prepare environment variables for SSH command execution
 *
 * @param envVars Array of environment variables in KEY=VALUE format
 * @returns Formatted string with export commands
 */
export function prepareEnvironmentVariables(envVars: string[]): string {
  return (
    envVars
      .map((env) => {
        const eqIdx = env.indexOf("=");
        if (eqIdx === -1) {
          // If no '=', treat the whole string as key with empty value
          return `export ${shellEscape([env])}=`;
        }
        const key = env.slice(0, eqIdx);
        const value = env.slice(eqIdx + 1);
        return `export ${shellEscape([key])}=${shellEscape([value])}`;
      })
      .join("; ") + "; "
  );
}
