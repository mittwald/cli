import { Config } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import ContextProvider from "./ContextProvider.js";
import WritableContextProvider from "./WritableContextProvider.js";
import UserContextProvider from "./UserContextProvider.js";
import TerraformContextProvider from "./TerraformContextProvider.js";
import DDEVContextProvider from "./DDEVContextProvider.js";
import InvalidContextError from "../error/InvalidContextError.js";

export type ContextNames =
  | "project"
  | "server"
  | "org"
  | "installation"
  | "domain"
  | "dnszone"
  | "mailaddress"
  | "maildeliverybox"
  | "conversation"
  | "backup";
export type ContextKey<N extends ContextNames = ContextNames> = `${N}-id`;
export type ContextMap = Partial<Record<ContextKey, ContextValue>>;
export type ContextMapUpdate = Partial<Record<ContextKey, string>>;
export type ContextValueSource = { type: string; identifier: string };
export type ContextValue = { value: string; source: ContextValueSource };

function isWritable(p: ContextProvider): p is WritableContextProvider {
  return "update" in p;
}

export const contextIDNormalizers: {
  [k in ContextKey]?: (
    apiClient: MittwaldAPIV2Client,
    id: string,
  ) => Promise<string>;
} = {};

export interface ContextOptions {
  onInitError: (err: unknown) => void;
}

export default class Context {
  private readonly contextData: Promise<ContextMap>;
  private readonly apiClient: MittwaldAPIV2Client;
  private readonly opts: ContextOptions;

  public readonly providers: ContextProvider[];

  public constructor(
    apiClient: MittwaldAPIV2Client,
    config: Config,
    opts: Partial<ContextOptions> = {},
  ) {
    this.apiClient = apiClient;
    this.providers = [
      new UserContextProvider(config),
      new TerraformContextProvider(),
      new DDEVContextProvider(apiClient),
    ];
    this.opts = {
      onInitError(err) {
        throw err;
      },
      ...opts,
    };
    this.contextData = this.initializeContextData();
  }

  private async initializeContextData(): Promise<ContextMap> {
    const contextData: ContextMap = {};

    for (const provider of this.providers) {
      try {
        const overrides = await provider.getOverrides();
        Object.assign(contextData, overrides);
      } catch (err) {
        if (err instanceof InvalidContextError) {
          this.opts.onInitError(err);
        }
      }
    }

    return contextData;
  }

  public async reset(): Promise<void> {
    for (const provider of this.providers) {
      if (isWritable(provider)) {
        await provider.reset();
      }
    }
  }

  private async persist(data: ContextMapUpdate): Promise<void> {
    for (const provider of this.providers) {
      if (isWritable(provider)) {
        await provider.update(data);
      }
    }
  }

  private async setContextValue(
    key: ContextKey,
    value: string,
  ): Promise<string> {
    if (key in contextIDNormalizers) {
      value = await contextIDNormalizers[key]!(this.apiClient, value);
    }

    await this.persist({ [key]: value });
    return value;
  }

  public async getContextValue(
    key: ContextKey,
  ): Promise<ContextValue | undefined> {
    const data = await this.contextData;
    if (key in data) {
      return data[key];
    }

    return undefined;
  }

  public setProjectId = (id: string) => this.setContextValue("project-id", id);
  public setServerId = (id: string) => this.setContextValue("server-id", id);
  public setOrgId = (id: string) => this.setContextValue("org-id", id);
  public setAppInstallationId = (id: string) =>
    this.setContextValue("installation-id", id);

  public projectId = () => this.getContextValue("project-id");
  public serverId = () => this.getContextValue("server-id");
  public orgId = () => this.getContextValue("org-id");
  public appInstallationId = () => this.getContextValue("installation-id");
}
