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

  public static arg = Args.custom<PortMapping>({
    parse: async (input) => PortMapping.fromString(input),
  });

  public static fromString(str: string): PortMapping {
    const [localPort, remotePort] = str.split(":");

    const localPortNum = parseInt(localPort);
    const remotePortNum = parseInt(remotePort);

    if (!this.validatePort(localPortNum) || !this.validatePort(remotePortNum)) {
      throw new Error(
        "Invalid port number. Ports must be between 1 and 65535.",
      );
    }

    return new PortMapping(localPortNum, remotePortNum);
  }
}
