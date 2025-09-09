// XML Document Structure Types for IntelliJ IDEA configuration files

export interface XmlDocument {
  "?xml": { "@_version": string; "@_encoding": string };
  project: XmlProject;
}

export interface XmlProject {
  "@_version": string;
  component: XmlComponent;
}

export interface XmlComponent {
  "@_name": string;
  configs?: XmlConfigs;
  option?: XmlOption;
  serverData?: XmlServerData;
  "@_serverName"?: string;
  "@_remoteFilesAllowedToDisappearOnAutoupload"?: string;
}

export interface XmlConfigs {
  sshConfig?: XmlSshConfig | XmlSshConfig[];
}

export interface XmlSshConfig {
  "@_authType": string;
  "@_host": string;
  "@_id": string;
  "@_port": string;
  "@_nameFormat": string;
  "@_username": string;
  "@_useOpenSSHConfig": string;
}

export interface XmlOption {
  "@_name": string;
  webServer?: XmlWebServer | XmlWebServer[];
}

export interface XmlWebServer {
  "@_id": string;
  "@_name": string;
  fileTransfer: XmlFileTransfer;
}

export interface XmlFileTransfer {
  "@_accessType": string;
  "@_host": string;
  "@_port": string;
  "@_sshConfigId": string;
  "@_sshConfig": string;
  "@_authAgent": string;
  advancedOptions: XmlAdvancedOptions;
}

export interface XmlAdvancedOptions {
  advancedOptions: {
    "@_dataProtectionLevel": string;
    "@_keepAliveTimeout": string;
    "@_passiveMode": string;
    "@_shareSSLContext": string;
  };
}

export interface XmlServerData {
  paths?: XmlPath | XmlPath[];
}

export interface XmlPath {
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
