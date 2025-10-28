import { Args } from "@oclif/core";

/** Represents a mapping between a local port and a remote port. */
export default class PortMapping {
  public readonly localPort: number;
  public readonly remotePort: number;

  constructor(localPort: number, remotePort: number) {
    this.localPort = localPort;
    this.remotePort = remotePort;
  }

  private static validatePort(port: number): boolean {
    return !isNaN(port) && port > 0 && port <= 65535;
  }

  private static isValidPortString(str: string): boolean {
    return /^\d+$/.test(str);
  }

  private static parseAndValidatePort(str: string): number {
    if (!PortMapping.isValidPortString(str)) {
      throw new Error(
        "Invalid port number. Ports must be between 1 and 65535.",
      );
    }

    const portNum = parseInt(str);

    if (!PortMapping.validatePort(portNum)) {
      throw new Error(
        "Invalid port number. Ports must be between 1 and 65535.",
      );
    }

    return portNum;
  }

  public static arg = Args.custom<PortMapping>({
    parse: async (input) => PortMapping.fromString(input),
  });

  /** @param str Port and protocol; example: `8080/tcp` */
  public static fromPortAndProtocol(str: string): PortMapping {
    const [localPort, protocol] = str.split("/");

    const portNum = parseInt(localPort);

    if (!PortMapping.validatePort(portNum)) {
      throw new Error(
        "Invalid port number. Ports must be between 1 and 65535.",
      );
    }

    if (protocol.toLowerCase() !== "tcp") {
      throw new Error("Only TCP protocol is supported.");
    }

    return new PortMapping(portNum, portNum);
  }

  public static fromString(str: string): PortMapping {
    const parts = str.split(":");

    // If only one part, use it for both local and remote port
    if (parts.length === 1) {
      const portNum = PortMapping.parseAndValidatePort(parts[0]);
      return new PortMapping(portNum, portNum);
    }

    const [localPort, remotePort] = parts;
    const localPortNum = PortMapping.parseAndValidatePort(localPort);
    const remotePortNum = PortMapping.parseAndValidatePort(remotePort);

    return new PortMapping(localPortNum, remotePortNum);
  }
}
