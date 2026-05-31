import { BaseCommand } from "../../lib/basecommands/BaseCommand.js";
import { GetBaseCommand } from "../../lib/basecommands/GetBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import { withContainerAndStackId } from "../../lib/resources/container/flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { printToPager } from "../../lib/util/pager.js";
import * as http2 from "node:http2";
import { readApiToken } from "../../lib/auth/token.js";

export class Logs extends BaseCommand {
  static summary = "Display logs of a specific container.";
  static description =
    "This command prints the log output of a specific container. " +
    "" +
    'When this command is run in a terminal, the output is piped through a pager. The pager is determined by your PAGER environment variable, with defaulting to "less". You can disable this behavior with the --no-pager flag.';

  static aliases = ["container:ls"];
  static flags = {
    ...GetBaseCommand.baseFlags,
    ...projectFlags,
    "no-pager": Flags.boolean({
      description: "Disable pager for output.",
    }),
    tail: Flags.integer({
      char: "t",
      description:
        "Number of lines to show from the end of the logs (minimum: 1).",
      min: 1,
    }),
  };
  static args = {
    "container-id": Args.string({
      description: "ID of the container for which to get logs",
      required: true,
    }),
  };

  /**
   * Note: This entire function is just a big workaround for the mStudio logs
   * API behaving erratically; the container logs endpoint tends to reset the
   * HTTP/2 stream instead of correctly closing it, which confuses Axios and all
   * other high-level HTTP client libraries.
   *
   * For this reason, this function bypasses the entire mittwald API client and
   * uses low-level features of the built-in node:http2 library.
   *
   * @private
   * @param stackId
   * @param serviceId
   * @param flags
   */
  private async fetchLogs(
    stackId: string,
    serviceId: string,
    flags: { tail?: number },
  ): Promise<string> {
    const queryParams = {
      ...(flags.tail && { tail: flags.tail.toString() }),
    };
    const url =
      this.apiClient.axios.defaults.baseURL +
      `v2/stacks/${stackId}/services/${serviceId}/logs?` +
      new URLSearchParams(queryParams).toString();

    const token = await readApiToken(this.config);
    const logs = await new Promise<string>((resolve, reject) => {
      const parsedUrl = new URL(url);
      const client = http2.connect(parsedUrl.origin);

      const req = client.request({
        ":method": "GET",
        ":path": parsedUrl.pathname + parsedUrl.search,
        "X-Access-Token": token,
      });

      const chunks: Buffer[] = [];

      req.on("data", (chunk: Buffer) => chunks.push(chunk));

      // 'close' fires after all data is received, even on RST_STREAM
      req.on("close", () => {
        client.close();
        resolve(Buffer.concat(chunks).toString("utf8"));
      });

      req.on("error", (err) => {
        // Swallow RST_STREAM / aborted errors if we already have data
        if (
          chunks.length > 0 &&
          (("code" in err && err.code === "ERR_HTTP2_STREAM_ERROR") ||
            err.message?.includes("aborted"))
        ) {
          // 'close' will still fire and resolve — don't reject
          return;
        }
        client.close();
        reject(err);
      });

      client.on("error", (err) => {
        reject(err);
      });

      req.end();
    });

    return logs;
  }

  async run(): Promise<void> {
    const { flags, args } = await this.parse(Logs);

    const [serviceId, stackId] = await withContainerAndStackId(
      this.apiClient,
      Logs,
      flags,
      args,
      this.config,
    );

    const usePager = process.stdin.isTTY && !flags["no-pager"];
    const logs = await this.fetchLogs(stackId, serviceId, flags);

    if (usePager) {
      printToPager(logs);
    } else {
      this.log(logs);
    }
  }
}
