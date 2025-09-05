import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { SSHConnectionData } from "../resources/ssh/types.js";

// Common XML configuration
const XML_PARSER_CONFIG = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseAttributeValue: false,
} as const;

const XML_BUILDER_CONFIG = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
  suppressBooleanAttributes: false,
} as const;

// Common XML document structure
const createXmlDocumentBase = () => ({
  "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
  project: { "@_version": "4" },
});

interface XmlManipulationConfig<T> {
  filename: string;
  componentName: string;
  checkDuplicateFn: (existing: T[], newItem: T) => boolean;
  addItemFn: (xmlDoc: Record<string, unknown>, newItem: T) => boolean;
  createNewDocumentFn: (newItem: T) => Record<string, unknown>;
}

export interface IntellijConfigData extends SSHConnectionData {
  appShortId: string;
}

export function generateIntellijConfigs(
  data: IntellijConfigData,
  projectDir: string = ".",
): void {
  const ideaDir = path.join(projectDir, ".idea");

  try {
    if (!fs.existsSync(ideaDir)) {
      fs.mkdirSync(ideaDir, { recursive: true });
    }
  } catch (error) {
    throw new Error(`Cannot create .idea directory: ${error instanceof Error ? error.message : error}`);
  }

  const sshConfigId = randomUUID();
  const webServerId = randomUUID();

  generateSshConfigsXml(data, sshConfigId, ideaDir);
  generateWebServersXml(data, webServerId, sshConfigId, ideaDir);
  generateDeploymentXml(data, ideaDir);
}

// Common XML manipulation utility
function manipulateXmlFile<T>(
  ideaDir: string,
  config: XmlManipulationConfig<T>,
  newItem: T,
): void {
  const configPath = path.join(ideaDir, config.filename);
  const parser = new XMLParser(XML_PARSER_CONFIG);
  const builder = new XMLBuilder(XML_BUILDER_CONFIG);

  let xmlDoc = loadExistingXmlDocument(configPath, parser);

  if (xmlDoc) {
    const wasAdded = tryAddToExistingDocument(xmlDoc, newItem, config);
    if (!wasAdded) {
      return; // Item already exists
    }
  } else {
    xmlDoc = config.createNewDocumentFn(newItem);
  }

  const xmlContent = builder.build(xmlDoc);
  fs.writeFileSync(configPath, xmlContent);
}

function loadExistingXmlDocument(
  configPath: string,
  parser: XMLParser,
): Record<string, unknown> | null {
  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(configPath, "utf8");
    const xmlDoc = parser.parse(content);

    if (!xmlDoc.project?.component) {
      throw new Error("Invalid XML structure");
    }
    return xmlDoc;
  } catch (error) {
    return null;
  }
}

function tryAddToExistingDocument<T>(
  xmlDoc: Record<string, unknown>,
  newItem: T,
  config: XmlManipulationConfig<T>,
): boolean {
  // This function delegates to the specific addItemFn
  // Return false if item already exists, true if added
  const result = config.addItemFn(xmlDoc, newItem);
  return result !== false;
}

// Helper function to handle array/single element patterns
function ensureArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item];
}

function addItemToArrayField<T>(
  container: Record<string, unknown>,
  fieldName: string,
  newItem: T,
  existingItems: T[],
): void {
  if (Array.isArray(container[fieldName])) {
    (container[fieldName] as T[]).push(newItem);
  } else if (container[fieldName]) {
    container[fieldName] = [container[fieldName] as T, newItem];
  } else {
    container[fieldName] = newItem;
  }
}

// SSH Config specific functions
function createSshConfigItem(
  host: string,
  username: string,
  configId: string,
): Record<string, string> {
  return {
    "@_authType": "OPEN_SSH",
    "@_host": host,
    "@_id": configId,
    "@_port": "22",
    "@_nameFormat": "DESCRIPTIVE",
    "@_username": username,
    "@_useOpenSSHConfig": "true",
  };
}

function generateSshConfigsXml(
  data: IntellijConfigData,
  configId: string,
  ideaDir: string,
): void {
  const sshConfigItem = createSshConfigItem(data.host, data.user, configId);

  const config: XmlManipulationConfig<Record<string, string>> = {
    filename: "sshConfigs.xml",
    componentName: "SshConfigs",
    checkDuplicateFn: (existing, newItem) =>
      existing.some((config) => config["@_host"] === newItem["@_host"]),
    addItemFn: (xmlDoc, newItem) => {
      const configs = (xmlDoc.project as any).component.configs;
      if (configs?.sshConfig) {
        const existingConfigs = ensureArray(configs.sshConfig);
        if (existingConfigs.some((config: Record<string, unknown>) => config["@_host"] === data.host)) {
          return false; // Already exists
        }
        addItemToArrayField(configs, "sshConfig", newItem, existingConfigs);
      } else {
        if (!configs) {
          (xmlDoc.project as any).component.configs = {};
        }
        (xmlDoc.project as any).component.configs.sshConfig = newItem;
      }
      return true;
    },
    createNewDocumentFn: (newItem) => ({
      ...createXmlDocumentBase(),
      project: {
        "@_version": "4",
        component: {
          "@_name": "SshConfigs",
          configs: { sshConfig: newItem },
        },
      },
    }),
  };

  manipulateXmlFile(ideaDir, config, sshConfigItem);
}

// Web Server specific functions
function createWebServerItem(
  serverId: string,
  appShortId: string,
  host: string,
  username: string,
  sshConfigId: string,
): Record<string, unknown> {
  return {
    "@_id": serverId,
    "@_name": appShortId,
    fileTransfer: {
      "@_accessType": "SFTP",
      "@_host": host,
      "@_port": "22",
      "@_sshConfigId": sshConfigId,
      "@_sshConfig": `${username}@${host}:22 agent`,
      "@_authAgent": "true",
      advancedOptions: {
        advancedOptions: {
          "@_dataProtectionLevel": "Private",
          "@_keepAliveTimeout": "0",
          "@_passiveMode": "true",
          "@_shareSSLContext": "true",
        },
      },
    },
  };
}

function generateWebServersXml(
  data: IntellijConfigData,
  serverId: string,
  sshConfigId: string,
  ideaDir: string,
): void {
  const webServerItem = createWebServerItem(serverId, data.appShortId, data.host, data.user, sshConfigId);

  const config: XmlManipulationConfig<Record<string, unknown>> = {
    filename: "webServers.xml",
    componentName: "WebServers",
    checkDuplicateFn: (existing, newItem) =>
      existing.some((server) => server["@_name"] === newItem["@_name"]),
    addItemFn: (xmlDoc, newItem) => {
      const servers = (xmlDoc.project as any).component.option;
      if (servers?.webServer) {
        const existingServers = ensureArray(servers.webServer);
        if (existingServers.some((server: Record<string, unknown>) => server["@_name"] === data.appShortId)) {
          return false; // Already exists
        }
        addItemToArrayField(servers, "webServer", newItem, existingServers);
      } else {
        if (!servers) {
          (xmlDoc.project as any).component.option = { "@_name": "servers" };
        }
        (xmlDoc.project as any).component.option.webServer = newItem;
      }
      return true;
    },
    createNewDocumentFn: (newItem) => ({
      ...createXmlDocumentBase(),
      project: {
        "@_version": "4",
        component: {
          "@_name": "WebServers",
          option: {
            "@_name": "servers",
            webServer: newItem,
          },
        },
      },
    }),
  };

  manipulateXmlFile(ideaDir, config, webServerItem);
}

// Deployment specific functions
function createDeploymentPathItem(
  appShortId: string,
  directory: string,
): Record<string, unknown> {
  return {
    "@_name": appShortId,
    serverdata: {
      mappings: {
        mapping: {
          "@_deploy": directory,
          "@_local": "$PROJECT_DIR$",
          "@_web": "/",
        },
      },
    },
  };
}

function generateDeploymentXml(
  data: IntellijConfigData,
  ideaDir: string,
): void {
  const deploymentPathItem = createDeploymentPathItem(data.appShortId, data.directory);

  const config: XmlManipulationConfig<Record<string, unknown>> = {
    filename: "deployment.xml",
    componentName: "PublishConfigData",
    checkDuplicateFn: (existing, newItem) =>
      existing.some((path) => path["@_name"] === newItem["@_name"]),
    addItemFn: (xmlDoc, newItem) => {
      const serverData = (xmlDoc.project as any).component.serverData;
      if (serverData?.paths) {
        const existingPaths = ensureArray(serverData.paths);
        if (existingPaths.some((path: Record<string, unknown>) => path["@_name"] === data.appShortId)) {
          return false; // Already exists
        }
        addItemToArrayField(serverData, "paths", newItem, existingPaths);
      } else {
        if (!(xmlDoc.project as any).component.serverData) {
          (xmlDoc.project as any).component.serverData = {};
        }
        (xmlDoc.project as any).component.serverData.paths = newItem;
      }
      return true;
    },
    createNewDocumentFn: (newItem) => ({
      ...createXmlDocumentBase(),
      project: {
        "@_version": "4",
        component: {
          "@_name": "PublishConfigData",
          "@_serverName": data.appShortId,
          "@_remoteFilesAllowedToDisappearOnAutoupload": "false",
          serverData: { paths: newItem },
        },
      },
    }),
  };

  manipulateXmlFile(ideaDir, config, deploymentPathItem);
}

