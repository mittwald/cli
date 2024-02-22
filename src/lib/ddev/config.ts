/**
 * This type defines a subset of the DDEV configuration that is relevant for the
 * DDEV init-config command. See the [full reference][ddev-config] for a full
 * reference.
 *
 * [ddev-config]: https://ddev.readthedocs.io/en/latest/users/configuration/config/
 */
export interface DDEVConfig {
  name: string;
  type: string;
  override_config: boolean;
  webserver_type: string;
  php_version: string;
  nodejs_version: string;
  web_environment: string[];
  docroot: string;
  database: DDEVDatabaseConfig;
}

export interface DDEVDatabaseConfig {
  type: string;
  version: string;
}

/**
 * Convert a DDEV configuration to a list of command-line flags that can be used
 * for the "ddev config" command.
 *
 * @param config
 */
export function ddevConfigToFlags(config: Partial<DDEVConfig>): string[] {
  const flags: string[] = [];

  if (config.type) {
    flags.push("--project-type", config.type);
  }

  if (config.webserver_type) {
    flags.push("--webserver-type", config.webserver_type);
  }

  if (config.php_version) {
    flags.push("--php-version", config.php_version);
  }

  if (config.docroot) {
    flags.push("--docroot", config.docroot);
  }

  if (config.database) {
    flags.push(
      "--database",
      `${config.database.type}:${config.database.version}`,
    );
  }

  for (const env of config.web_environment || []) {
    flags.push("--web-environment-add", env);
  }

  return flags;
}
