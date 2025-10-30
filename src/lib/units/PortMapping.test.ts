import { describe, expect, it } from "@jest/globals";
import PortMapping from "./PortMapping.js";

describe("PortMapping", () => {
  // Test: Successfully create PortMapping instance using fromString
  it("should correctly parse valid port mapping string", () => {
    const result = PortMapping.fromString("8080:9090");
    expect(result.localPort).toBe(8080);
    expect(result.remotePort).toBe(9090);
  });

  // Test: Successfully parse single integer as identical local and remote port
  it("should correctly parse single integer to identical ports", () => {
    const result = PortMapping.fromString("8080");
    expect(result.localPort).toBe(8080);
    expect(result.remotePort).toBe(8080);
  });

  // Test: Throws an error for invalid local port
  it("should throw an error for invalid local port", () => {
    expect(() => PortMapping.fromString("100000:8080")).toThrow(
      "Invalid port number. Ports must be between 1 and 65535.",
    );
  });

  // Test: Throws an error for invalid remote port
  it("should throw an error for invalid remote port", () => {
    expect(() => PortMapping.fromString("8080:70000")).toThrow(
      "Invalid port number. Ports must be between 1 and 65535.",
    );
  });

  // Test: Throws an error when input format is incorrect
  it("should throw an error for invalid string format", () => {
    expect(() => PortMapping.fromString("8080-9090")).toThrow(
      "Invalid port number. Ports must be between 1 and 65535.",
    );
  });

  // Test: Throws an error for invalid single port
  it("should throw an error for invalid single port", () => {
    expect(() => PortMapping.fromString("100000")).toThrow(
      "Invalid port number. Ports must be between 1 and 65535.",
    );
  });

  // Test: Successfully assign local and remote ports via constructor
  it("should correctly initialize PortMapping with valid ports", () => {
    const portMapping = new PortMapping(3000, 4000);
    expect(portMapping.localPort).toBe(3000);
    expect(portMapping.remotePort).toBe(4000);
  });
});
