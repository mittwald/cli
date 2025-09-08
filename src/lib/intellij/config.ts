import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
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

// XML Document Structure Types
interface XmlDocument {
  "?xml": { "@_version": string; "@_encoding": string };
  project: XmlProject;
}

interface XmlProject {
  "@_version": string;
  component: XmlComponent;
}

interface XmlComponent {
  "@_name": string;
  configs?: XmlConfigs;
  option?: XmlOption;
  serverData?: XmlServerData;
  "@_serverName"?: string;
  "@_remoteFilesAllowedToDisappearOnAutoupload"?: string;
}

interface XmlConfigs {
  sshConfig?: XmlSshConfig | XmlSshConfig[];
}

interface XmlSshConfig {
  "@_authType": string;
  "@_host": string;
  "@_id": string;
  "@_port": string;
  "@_nameFormat": string;
  "@_username": string;
  "@_useOpenSSHConfig": string;
}

interface XmlOption {
  "@_name": string;
  webServer?: XmlWebServer | XmlWebServer[];
}

interface XmlWebServer {
  "@_id": string;
  "@_name": string;
  fileTransfer: XmlFileTransfer;
}

interface XmlFileTransfer {
  "@_accessType": string;
  "@_host": string;
  "@_port": string;
  "@_sshConfigId": string;
  "@_sshConfig": string;
  "@_authAgent": string;
  advancedOptions: XmlAdvancedOptions;
}

interface XmlAdvancedOptions {
  advancedOptions: {
    "@_dataProtectionLevel": string;
    "@_keepAliveTimeout": string;
    "@_passiveMode": string;
    "@_shareSSLContext": string;
  };
}

interface XmlServerData {
  paths?: XmlPath | XmlPath[];
}

interface XmlPath {
  "@_name": string;
  serverdata: {
    mappings: {
      mapping: {
        "@_deploy": string;
        "@_local": string;
        "@_web": string;
      };
    };
  };
}

interface XmlManipulationConfig<T> {
  filename: string;
  componentName: string;
  checkDuplicateFn: (existing: T[], newItem: T) => boolean;
  addItemFn: (xmlDoc: XmlDocument, newItem: T) => boolean;
  createNewDocumentFn: (newItem: T) => XmlDocument;
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
    throw new Error(
      `Cannot create .idea directory: ${error instanceof Error ? error.message : error}`,
    );
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
): XmlDocument | null {
  if (!fs.existsSync(configPath)) {
    return null;
  }

  const content = fs.readFileSync(configPath, "utf8");
  const xmlDoc = parser.parse(content);

  if (!xmlDoc.project?.component) {
    throw new Error("Invalid XML structure");
  }
  return xmlDoc;
}

function tryAddToExistingDocument<T>(
  xmlDoc: XmlDocument,
  newItem: T,
  config: XmlManipulationConfig<T>,
): boolean {
  // This function delegates to the specific addItemFn
  // Return false if item already exists, true if added
  return config.addItemFn(xmlDoc, newItem);
}

// Helper function to handle array/single element patterns
function ensureArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item];
}

// Specific type-safe helper functions for each XML structure
function addSshConfig(configs: XmlConfigs, newConfig: XmlSshConfig): void {
  if (Array.isArray(configs.sshConfig)) {
    configs.sshConfig.push(newConfig);
  } else if (configs.sshConfig) {
    configs.sshConfig = [configs.sshConfig, newConfig];
  } else {
    configs.sshConfig = newConfig;
  }
}

function addWebServer(option: XmlOption, newServer: XmlWebServer): void {
  if (Array.isArray(option.webServer)) {
    option.webServer.push(newServer);
  } else if (option.webServer) {
    option.webServer = [option.webServer, newServer];
  } else {
    option.webServer = newServer;
  }
}

function addDeploymentPath(serverData: XmlServerData, newPath: XmlPath): void {
  if (Array.isArray(serverData.paths)) {
    serverData.paths.push(newPath);
  } else if (serverData.paths) {
    serverData.paths = [serverData.paths, newPath];
  } else {
    serverData.paths = newPath;
  }
}

// SSH Config specific functions
function createSshConfigItem(
  host: string,
  username: string,
  configId: string,
): XmlSshConfig {
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

  const config: XmlManipulationConfig<XmlSshConfig> = {
    filename: "sshConfigs.xml",
    componentName: "SshConfigs",
    checkDuplicateFn: (existing, newItem) =>
      existing.some((config) => config["@_host"] === newItem["@_host"]),
    addItemFn: (xmlDoc, newItem) => {
      const configs = xmlDoc.project.component.configs;
      if (configs?.sshConfig) {
        const existingConfigs = ensureArray(configs.sshConfig);
        if (existingConfigs.some((config) => config["@_host"] === data.host)) {
          return false; // Already exists
        }
        addSshConfig(configs, newItem);
      } else {
        if (!xmlDoc.project.component.configs) {
          xmlDoc.project.component.configs = {};
        }
        xmlDoc.project.component.configs.sshConfig = newItem;
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
): XmlWebServer {
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
  const webServerItem = createWebServerItem(
    serverId,
    data.appShortId,
    data.host,
    data.user,
    sshConfigId,
  );

  const config: XmlManipulationConfig<XmlWebServer> = {
    filename: "webServers.xml",
    componentName: "WebServers",
    checkDuplicateFn: (existing, newItem) =>
      existing.some((server) => server["@_name"] === newItem["@_name"]),
    addItemFn: (xmlDoc, newItem) => {
      const servers = xmlDoc.project.component.option;
      if (servers?.webServer) {
        const existingServers = ensureArray(servers.webServer);
        if (
          existingServers.some((server) => server["@_name"] === data.appShortId)
        ) {
          return false; // Already exists
        }
        addWebServer(servers, newItem);
      } else {
        if (!xmlDoc.project.component.option) {
          xmlDoc.project.component.option = { "@_name": "servers" };
        }
        xmlDoc.project.component.option.webServer = newItem;
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
): XmlPath {
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
  const deploymentPathItem = createDeploymentPathItem(
    data.appShortId,
    data.directory,
  );

  const config: XmlManipulationConfig<XmlPath> = {
    filename: "deployment.xml",
    componentName: "PublishConfigData",
    checkDuplicateFn: (existing, newItem) =>
      existing.some((path) => path["@_name"] === newItem["@_name"]),
    addItemFn: (xmlDoc, newItem) => {
      const serverData = xmlDoc.project.component.serverData;
      if (serverData?.paths) {
        const existingPaths = ensureArray(serverData.paths);
        if (existingPaths.some((path) => path["@_name"] === data.appShortId)) {
          return false; // Already exists
        }
        addDeploymentPath(serverData, newItem);
      } else {
        if (!xmlDoc.project.component.serverData) {
          xmlDoc.project.component.serverData = {};
        }
        xmlDoc.project.component.serverData.paths = newItem;
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
