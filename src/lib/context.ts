import { Config } from "@oclif/core";
import * as fs from "fs/promises";
import * as path from "path";

export class Context {
  private readonly config: Config;
  private readonly contextData: Promise<Record<string, string>>;

  public constructor(config: Config) {
    this.config = config;
    this.contextData = this.initializeContextData();
  }

  private async initializeContextData(): Promise<Record<string, string>> {
    try {
      const contents = await fs.readFile(
        path.join(this.config.configDir, "context.json"),
        "utf-8",
      );
      return JSON.parse(contents);
    } catch (e) {
      if (e instanceof Error && "code" in e && e.code === "ENOENT") {
        return {};
      }
      throw e;
    }
  }

  private async persist(data: Record<string, string>): Promise<void> {
    await fs.writeFile(
      path.join(this.config.configDir, "context.json"),
      JSON.stringify(data),
      "utf-8",
    );
  }

  private async setContextValue(key: string, value: string): Promise<void> {
    const data = await this.contextData;
    return await this.persist({ ...data, [key]: value });
  }

  public async getContextValue(key: string): Promise<string | undefined> {
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
