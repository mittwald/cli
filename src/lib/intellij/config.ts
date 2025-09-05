import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { SSHConnectionData } from "../resources/ssh/types.js";

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

function generateSshConfigsXml(
  data: IntellijConfigData,
  configId: string,
  ideaDir: string,
): void {
  const configPath = path.join(ideaDir, "sshConfigs.xml");
  const [username, host] = parseUserHost(data.user, data.host);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: false,
  });
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    format: true,
    suppressBooleanAttributes: false,
  });

  let xmlDoc;

  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, "utf8");
      xmlDoc = parser.parse(content);

      // Ensure proper structure exists
      if (!xmlDoc.project?.component) {
        throw new Error("Invalid XML structure");
      }
    } catch (error) {
      // If parsing fails, create a new document
      xmlDoc = null;
    }
  }

  if (xmlDoc) {
    // Check if this host already exists
    const configs = xmlDoc.project.component.configs;
    if (configs && configs.sshConfig) {
      const existingConfigs = Array.isArray(configs.sshConfig)
        ? configs.sshConfig
        : [configs.sshConfig];
      if (
        existingConfigs.some(
          (config: Record<string, unknown>) => config["@_host"] === host,
        )
      ) {
        return; // Host already exists
      }

      // Add new config
      if (Array.isArray(configs.sshConfig)) {
        configs.sshConfig.push({
          "@_authType": "OPEN_SSH",
          "@_host": host,
          "@_id": configId,
          "@_port": "22",
          "@_nameFormat": "DESCRIPTIVE",
          "@_username": username,
          "@_useOpenSSHConfig": "true",
        });
      } else {
        configs.sshConfig = [
          configs.sshConfig,
          {
            "@_authType": "OPEN_SSH",
            "@_host": host,
            "@_id": configId,
            "@_port": "22",
            "@_nameFormat": "DESCRIPTIVE",
            "@_username": username,
            "@_useOpenSSHConfig": "true",
          },
        ];
      }
    } else {
      // First SSH config
      if (!configs) {
        xmlDoc.project.component.configs = {};
      }
      xmlDoc.project.component.configs.sshConfig = {
        "@_authType": "OPEN_SSH",
        "@_host": host,
        "@_id": configId,
        "@_port": "22",
        "@_nameFormat": "DESCRIPTIVE",
        "@_username": username,
        "@_useOpenSSHConfig": "true",
      };
    }
  }
  
  if (!xmlDoc) {
    // Create new XML document
    xmlDoc = {
      "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
      project: {
        "@_version": "4",
        component: {
          "@_name": "SshConfigs",
          configs: {
            sshConfig: {
              "@_authType": "OPEN_SSH",
              "@_host": host,
              "@_id": configId,
              "@_port": "22",
              "@_nameFormat": "DESCRIPTIVE",
              "@_username": username,
              "@_useOpenSSHConfig": "true",
            },
          },
        },
      },
    };
  }

  const xmlContent = builder.build(xmlDoc);
  fs.writeFileSync(configPath, xmlContent);
}

function generateWebServersXml(
  data: IntellijConfigData,
  serverId: string,
  sshConfigId: string,
  ideaDir: string,
): void {
  const configPath = path.join(ideaDir, "webServers.xml");
  const [username, host] = parseUserHost(data.user, data.host);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: false,
  });
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    format: true,
    suppressBooleanAttributes: false,
  });

  let xmlDoc;

  const newServer = {
    "@_id": serverId,
    "@_name": data.appShortId,
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

  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, "utf8");
    xmlDoc = parser.parse(content);

    // Check if this server already exists
    const servers = xmlDoc.project.component.option;
    if (servers && servers.webServer) {
      const existingServers = Array.isArray(servers.webServer)
        ? servers.webServer
        : [servers.webServer];
      if (
        existingServers.some(
          (server: Record<string, unknown>) =>
            server["@_name"] === data.appShortId,
        )
      ) {
        return; // Server already exists
      }

      // Add new server
      if (Array.isArray(servers.webServer)) {
        servers.webServer.push(newServer);
      } else {
        servers.webServer = [servers.webServer, newServer];
      }
    } else {
      // First web server
      if (!servers) {
        xmlDoc.project.component.option = { "@_name": "servers" };
      }
      xmlDoc.project.component.option.webServer = newServer;
    }
  } else {
    // Create new XML document
    xmlDoc = {
      "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
      project: {
        "@_version": "4",
        component: {
          "@_name": "WebServers",
          option: {
            "@_name": "servers",
            webServer: newServer,
          },
        },
      },
    };
  }

  const xmlContent = builder.build(xmlDoc);
  fs.writeFileSync(configPath, xmlContent);
}

function generateDeploymentXml(
  data: IntellijConfigData,
  ideaDir: string,
): void {
  const configPath = path.join(ideaDir, "deployment.xml");

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: false,
  });
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    format: true,
    suppressBooleanAttributes: false,
  });

  let xmlDoc;

  const newPath = {
    "@_name": data.appShortId,
    serverdata: {
      mappings: {
        mapping: {
          "@_deploy": data.directory,
          "@_local": "$PROJECT_DIR$",
          "@_web": "/",
        },
      },
    },
  };

  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, "utf8");
    xmlDoc = parser.parse(content);

    // Check if this server already exists
    const serverData = xmlDoc.project.component.serverData;
    if (serverData && serverData.paths) {
      const existingPaths = Array.isArray(serverData.paths)
        ? serverData.paths
        : [serverData.paths];
      if (
        existingPaths.some(
          (p: Record<string, unknown>) => p["@_name"] === data.appShortId,
        )
      ) {
        return; // Path already exists
      }

      // Add new path
      if (Array.isArray(serverData.paths)) {
        serverData.paths.push(newPath);
      } else {
        serverData.paths = [serverData.paths, newPath];
      }
    } else {
      // First server data
      if (!xmlDoc.project.component.serverData) {
        xmlDoc.project.component.serverData = {};
      }
      xmlDoc.project.component.serverData.paths = newPath;
    }
  } else {
    // Create new XML document
    xmlDoc = {
      "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
      project: {
        "@_version": "4",
        component: {
          "@_name": "PublishConfigData",
          "@_serverName": data.appShortId,
          "@_remoteFilesAllowedToDisappearOnAutoupload": "false",
          serverData: {
            paths: newPath,
          },
        },
      },
    };
  }

  const xmlContent = builder.build(xmlDoc);
  fs.writeFileSync(configPath, xmlContent);
}

function parseUserHost(user: string, host: string): [string, string] {
  const atIndex = user.indexOf("@");
  if (atIndex > -1) {
    return [user.substring(0, atIndex), host];
  }
  return [user, host];
}
