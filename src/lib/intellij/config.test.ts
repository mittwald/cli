import { describe, expect, test, beforeEach, afterEach } from "@jest/globals";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { XMLParser } from "fast-xml-parser";
import { generateIntellijConfigs, IntellijConfigData } from "./config.js";

describe("IntelliJ Config Generator", () => {
  let tempDir: string;
  let testData: IntellijConfigData;
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "intellij-test-"));
    testData = {
      host: "ssh.test.example.com",
      user: "testuser@app123",
      directory: "/var/www/html/app123",
      appShortId: "app123",
    };
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe("generateIntellijConfigs", () => {
    test("should create .idea directory if it doesn't exist", () => {
      generateIntellijConfigs(testData, tempDir);
      
      const ideaDir = path.join(tempDir, ".idea");
      expect(fs.existsSync(ideaDir)).toBe(true);
      expect(fs.statSync(ideaDir).isDirectory()).toBe(true);
    });

    test("should generate all three configuration files", () => {
      generateIntellijConfigs(testData, tempDir);
      
      const ideaDir = path.join(tempDir, ".idea");
      expect(fs.existsSync(path.join(ideaDir, "sshConfigs.xml"))).toBe(true);
      expect(fs.existsSync(path.join(ideaDir, "webServers.xml"))).toBe(true);
      expect(fs.existsSync(path.join(ideaDir, "deployment.xml"))).toBe(true);
    });

    test("should generate valid XML files", () => {
      generateIntellijConfigs(testData, tempDir);
      
      const ideaDir = path.join(tempDir, ".idea");
      
      // Test that each file can be parsed without errors
      const sshContent = fs.readFileSync(path.join(ideaDir, "sshConfigs.xml"), "utf8");
      expect(() => parser.parse(sshContent)).not.toThrow();
      
      const webContent = fs.readFileSync(path.join(ideaDir, "webServers.xml"), "utf8");
      expect(() => parser.parse(webContent)).not.toThrow();
      
      const deployContent = fs.readFileSync(path.join(ideaDir, "deployment.xml"), "utf8");
      expect(() => parser.parse(deployContent)).not.toThrow();
    });
  });

  describe("SSH Configs XML", () => {
    test("should create SSH config with correct attributes", () => {
      generateIntellijConfigs(testData, tempDir);
      
      const configPath = path.join(tempDir, ".idea", "sshConfigs.xml");
      const content = fs.readFileSync(configPath, "utf8");
      const xmlDoc = parser.parse(content);
      
      expect(xmlDoc.project["@_version"]).toBe("4");
      expect(xmlDoc.project.component["@_name"]).toBe("SshConfigs");
      
      const sshConfig = xmlDoc.project.component.configs.sshConfig;
      expect(sshConfig["@_authType"]).toBe("OPEN_SSH");
      expect(sshConfig["@_host"]).toBe("ssh.test.example.com");
      expect(sshConfig["@_port"]).toBe("22");
      expect(sshConfig["@_username"]).toBe("testuser@app123");
      expect(sshConfig["@_useOpenSSHConfig"]).toBe("true");
      expect(sshConfig["@_nameFormat"]).toBe("DESCRIPTIVE");
      expect(sshConfig["@_id"]).toBeDefined();
    });

    test("should not add duplicate SSH configs for same host", () => {
      generateIntellijConfigs(testData, tempDir);
      generateIntellijConfigs(testData, tempDir); // Run twice
      
      const configPath = path.join(tempDir, ".idea", "sshConfigs.xml");
      const content = fs.readFileSync(configPath, "utf8");
      const xmlDoc = parser.parse(content);
      
      const sshConfig = xmlDoc.project.component.configs.sshConfig;
      expect(Array.isArray(sshConfig)).toBe(false); // Should still be single config
    });

    test("should add multiple SSH configs for different hosts", () => {
      generateIntellijConfigs(testData, tempDir);
      
      const differentHostData = { ...testData, host: "ssh.other.example.com", appShortId: "app456" };
      generateIntellijConfigs(differentHostData, tempDir);
      
      const configPath = path.join(tempDir, ".idea", "sshConfigs.xml");
      const content = fs.readFileSync(configPath, "utf8");
      const xmlDoc = parser.parse(content);
      
      const sshConfigs = xmlDoc.project.component.configs.sshConfig;
      expect(Array.isArray(sshConfigs)).toBe(true);
      expect(sshConfigs).toHaveLength(2);
      expect(sshConfigs[0]["@_host"]).toBe("ssh.test.example.com");
      expect(sshConfigs[1]["@_host"]).toBe("ssh.other.example.com");
    });

    test("should handle existing SSH config file correctly", () => {
      const ideaDir = path.join(tempDir, ".idea");
      fs.mkdirSync(ideaDir, { recursive: true });
      
      const existingConfig = `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="SshConfigs">
    <configs>
      <sshConfig authType="OPEN_SSH" host="existing.example.com" id="existing-id" port="22" nameFormat="DESCRIPTIVE" username="existing" useOpenSSHConfig="true" />
    </configs>
  </component>
</project>`;
      
      fs.writeFileSync(path.join(ideaDir, "sshConfigs.xml"), existingConfig);
      
      generateIntellijConfigs(testData, tempDir);
      
      const configPath = path.join(ideaDir, "sshConfigs.xml");
      const content = fs.readFileSync(configPath, "utf8");
      const xmlDoc = parser.parse(content);
      
      const sshConfigs = xmlDoc.project.component.configs.sshConfig;
      expect(Array.isArray(sshConfigs)).toBe(true);
      expect(sshConfigs).toHaveLength(2);
    });
  });

  describe("Web Servers XML", () => {
    test("should create web server config with correct structure", () => {
      generateIntellijConfigs(testData, tempDir);
      
      const configPath = path.join(tempDir, ".idea", "webServers.xml");
      const content = fs.readFileSync(configPath, "utf8");
      const xmlDoc = parser.parse(content);
      
      expect(xmlDoc.project["@_version"]).toBe("4");
      expect(xmlDoc.project.component["@_name"]).toBe("WebServers");
      expect(xmlDoc.project.component.option["@_name"]).toBe("servers");
      
      const webServer = xmlDoc.project.component.option.webServer;
      expect(webServer["@_name"]).toBe("app123");
      expect(webServer["@_id"]).toBeDefined();
      
      const fileTransfer = webServer.fileTransfer;
      expect(fileTransfer["@_accessType"]).toBe("SFTP");
      expect(fileTransfer["@_host"]).toBe("ssh.test.example.com");
      expect(fileTransfer["@_port"]).toBe("22");
      expect(fileTransfer["@_authAgent"]).toBe("true");
      expect(fileTransfer["@_sshConfig"]).toBe("testuser@app123@ssh.test.example.com:22 agent");
      
      const advancedOptions = fileTransfer.advancedOptions.advancedOptions;
      expect(advancedOptions["@_dataProtectionLevel"]).toBe("Private");
      expect(advancedOptions["@_keepAliveTimeout"]).toBe("0");
      expect(advancedOptions["@_passiveMode"]).toBe("true");
      expect(advancedOptions["@_shareSSLContext"]).toBe("true");
    });

    test("should not add duplicate web servers for same app", () => {
      generateIntellijConfigs(testData, tempDir);
      generateIntellijConfigs(testData, tempDir); // Run twice
      
      const configPath = path.join(tempDir, ".idea", "webServers.xml");
      const content = fs.readFileSync(configPath, "utf8");
      const xmlDoc = parser.parse(content);
      
      const webServer = xmlDoc.project.component.option.webServer;
      expect(Array.isArray(webServer)).toBe(false); // Should still be single server
    });
  });

  describe("Deployment XML", () => {
    test("should create deployment config with correct mapping", () => {
      generateIntellijConfigs(testData, tempDir);
      
      const configPath = path.join(tempDir, ".idea", "deployment.xml");
      const content = fs.readFileSync(configPath, "utf8");
      const xmlDoc = parser.parse(content);
      
      expect(xmlDoc.project["@_version"]).toBe("4");
      expect(xmlDoc.project.component["@_name"]).toBe("PublishConfigData");
      expect(xmlDoc.project.component["@_serverName"]).toBe("app123");
      expect(xmlDoc.project.component["@_remoteFilesAllowedToDisappearOnAutoupload"]).toBe("false");
      
      const paths = xmlDoc.project.component.serverData.paths;
      expect(paths["@_name"]).toBe("app123");
      
      const mapping = paths.serverdata.mappings.mapping;
      expect(mapping["@_deploy"]).toBe("/var/www/html/app123");
      expect(mapping["@_local"]).toBe("$PROJECT_DIR$");
      expect(mapping["@_web"]).toBe("/");
    });

    test("should not add duplicate deployment configs for same app", () => {
      generateIntellijConfigs(testData, tempDir);
      generateIntellijConfigs(testData, tempDir); // Run twice
      
      const configPath = path.join(tempDir, ".idea", "deployment.xml");
      const content = fs.readFileSync(configPath, "utf8");
      const xmlDoc = parser.parse(content);
      
      const paths = xmlDoc.project.component.serverData.paths;
      expect(Array.isArray(paths)).toBe(false); // Should still be single path
    });
  });

  describe("SSH username handling", () => {
    test("should use complete user string as SSH username", () => {
      const userData = { ...testData, user: "m.helmich@mittwald.de@a-ce3rzc" };
      generateIntellijConfigs(userData, tempDir);
      
      const configPath = path.join(tempDir, ".idea", "sshConfigs.xml");
      const content = fs.readFileSync(configPath, "utf8");
      const xmlDoc = parser.parse(content);
      
      const sshConfig = xmlDoc.project.component.configs.sshConfig;
      expect(sshConfig["@_username"]).toBe("m.helmich@mittwald.de@a-ce3rzc");
      
      // Also check web server config uses the same username
      const webConfigPath = path.join(tempDir, ".idea", "webServers.xml");
      const webContent = fs.readFileSync(webConfigPath, "utf8");
      const webXmlDoc = parser.parse(webContent);
      const webServer = webXmlDoc.project.component.option.webServer;
      expect(webServer.fileTransfer["@_sshConfig"]).toBe("m.helmich@mittwald.de@a-ce3rzc@ssh.test.example.com:22 agent");
    });

    test("should handle simple usernames as-is", () => {
      const userData = { ...testData, user: "plainuser" };
      generateIntellijConfigs(userData, tempDir);
      
      const configPath = path.join(tempDir, ".idea", "sshConfigs.xml");
      const content = fs.readFileSync(configPath, "utf8");
      const xmlDoc = parser.parse(content);
      
      const sshConfig = xmlDoc.project.component.configs.sshConfig;
      expect(sshConfig["@_username"]).toBe("plainuser");
    });
  });

  describe("Error handling", () => {
    test("should handle invalid directory gracefully", () => {
      const invalidDir = "/root/nonexistent/readonly";
      
      // This should throw an error for invalid directory
      expect(() => {
        generateIntellijConfigs(testData, invalidDir);
      }).toThrow("Cannot create .idea directory");
    });

    test("should throw error for malformed existing XML files", () => {
      const ideaDir = path.join(tempDir, ".idea");
      fs.mkdirSync(ideaDir, { recursive: true });
      
      // Create malformed XML
      const malformedXml = "<?xml version='1.0'?><project><unclosed>";
      fs.writeFileSync(path.join(ideaDir, "sshConfigs.xml"), malformedXml);
      
      // Should throw an error for malformed XML
      expect(() => {
        generateIntellijConfigs(testData, tempDir);
      }).toThrow();
    });
  });

  describe("XML structure validation", () => {
    test("should generate properly formatted XML with correct declarations", () => {
      generateIntellijConfigs(testData, tempDir);
      
      const ideaDir = path.join(tempDir, ".idea");
      
      // Check SSH config
      const sshContent = fs.readFileSync(path.join(ideaDir, "sshConfigs.xml"), "utf8");
      expect(sshContent).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
      expect(sshContent).toContain('<project version="4">');
      
      // Check web servers
      const webContent = fs.readFileSync(path.join(ideaDir, "webServers.xml"), "utf8");
      expect(webContent).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
      expect(webContent).toContain('<project version="4">');
      
      // Check deployment
      const deployContent = fs.readFileSync(path.join(ideaDir, "deployment.xml"), "utf8");
      expect(deployContent).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
      expect(deployContent).toContain('<project version="4">');
    });
  });
});