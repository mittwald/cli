import { RenderBaseCommand } from "../../rendering/react/RenderBaseCommand.js";
import { FC, ReactNode } from "react";
import { Context } from "../../lib/context.js";
import { SingleResult } from "../../rendering/react/components/SingleResult.js";
import { Value } from "../../rendering/react/components/Value.js";
import { usePromise } from "@mittwald/react-use-promise";
import { Note } from "../../rendering/react/components/Note.js";
import { Box } from "ink";
import { Set } from "./set.js";
import { RenderJson } from "../../rendering/react/json/RenderJson.js";
import { useRenderContext } from "../../rendering/react/context.js";

const GetContext: FC<{ ctx: Context }> = ({ ctx }) => {
  const rows: Record<string, ReactNode> = {};
  const { renderAsJson } = useRenderContext();
  const values: Record<string, string | undefined> = {};

  for (const key of ["project-id", "server-id", "org-id"]) {
    const value = usePromise(ctx.getContextValue.bind(ctx), [key]);
    if (value) {
      rows[`--${key}`] = <Value>{value}</Value>;
      values[key] = value;
    } else {
      rows[`--${key}`] = <Value notSet />;
    }
  }

  if (renderAsJson) {
    return <RenderJson name={"context"} data={values} />;
  }

  return (
    <>
      <Box flexDirection="column">
        <SingleResult title="Current CLI context" rows={rows} />
        <Note marginY={1}>
          Use the <Value>mw context set</Value> command to set one of the values
          listed above.
        </Note>
      </Box>
    </>
  );
};

export class Get extends RenderBaseCommand<typeof Get> {
  static summary = "Print an overview of currently set context parameters";
  static description = Set.description;
  static flags = { ...RenderBaseCommand.buildFlags() };

  protected render(): ReactNode {
    const ctx = new Context(this.config);
    return <GetContext ctx={ctx} />;
  }
}
