import { RenderBaseCommand } from "../../lib/basecommands/RenderBaseCommand.js";
import { ReactNode } from "react";
import { Set as SetCommand } from "./set.js";
import Context from "../../lib/context/Context.js";
import { ContextOverview } from "../../rendering/react/components/Context/ContextOverview.js";

export class Get extends RenderBaseCommand<typeof Get> {
  static summary = "Print an overview of currently set context parameters";
  static description = SetCommand.description;
  static flags = { ...RenderBaseCommand.buildFlags() };

  protected render(): ReactNode {
    const ctx = new Context(this.apiClient, this.config);
    return <ContextOverview ctx={ctx} />;
  }
}
