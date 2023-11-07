import { Config } from "@oclif/core";
import { TerraformContextProvider } from "./context_terraform.js";
import { UserContextProvider } from "./context_user.js";

export type ContextNames = "project" | "server" | "org" | "installation";
export type ContextKey<N extends ContextNames = ContextNames> = `${N}-id`;
export type ContextMap = Partial<Record<ContextKey, string>>;

export interface ContextProvider {
  name: string;
  getOverrides(): Promise<ContextMap>;
}

export interface WritableContextProvider extends ContextProvider {
  persist(data: ContextMap): Promise<void>;
}

function isWritable(p: ContextProvider): p is WritableContextProvider {
  return "persist" in p;
}

export class Context {
  private readonly contextData: Promise<ContextMap>;

  public readonly providers: ContextProvider[];

  public constructor(config: Config) {
    this.providers = [
      new UserContextProvider(config),
      new TerraformContextProvider(),
    ];
    this.contextData = this.initializeContextData();
  }

  private async initializeContextData(): Promise<ContextMap> {
    const contextData: ContextMap = {};

    for (const provider of this.providers) {
      const overrides = await provider.getOverrides();
      Object.assign(contextData, overrides);
    }

    return contextData;
  }

  private async persist(data: Record<string, string>): Promise<void> {
    for (const provider of this.providers) {
      if (isWritable(provider)) {
        await provider.persist(data);
      }
    }
  }

  private async setContextValue(key: string, value: string): Promise<void> {
    const data = await this.contextData;
    return await this.persist({ ...data, [key]: value });
  }

  public async getContextValue(key: ContextKey): Promise<string | undefined> {
    const data = await this.contextData;
    if (key in data) {
      return data[key];
    }

    return undefined;
  }

  public setProjectId = (id: string) => this.setContextValue("project-id", id);
  public setServerId = (id: string) => this.setContextValue("server-id", id);
  public setOrgId = (id: string) => this.setContextValue("org-id", id);

  public projectId = () => this.getContextValue("project-id");
  public serverId = () => this.getContextValue("server-id");
  public orgId = () => this.getContextValue("org-id");
}
