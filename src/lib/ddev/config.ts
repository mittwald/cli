/**
 * This type defines a subset of the DDEV configuration that is relevant for the
 * DDEV init-config command. See the [full reference][ddev-config] for a full
 * reference.
 *
 * [ddev-config]: https://ddev.readthedocs.io/en/latest/users/configuration/config/
 */
export interface DDEVConfig {
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
