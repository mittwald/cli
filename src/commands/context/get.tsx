import { RenderBaseCommand } from "../../rendering/react/RenderBaseCommand.js";
import { FC, ReactNode } from "react";
import {
  Context,
  ContextKey,
  ContextValue,
  ContextValueSource,
} from "../../lib/context.js";
import { SingleResult } from "../../rendering/react/components/SingleResult.js";
import { Value } from "../../rendering/react/components/Value.js";
import { usePromise } from "@mittwald/react-use-promise";
import { Note } from "../../rendering/react/components/Note.js";
import { Box, Text } from "ink";
import { Set } from "./set.js";
import { RenderJson } from "../../rendering/react/json/RenderJson.js";
import { useRenderContext } from "../../rendering/react/context.js";
import { LocalFilename } from "../../rendering/react/components/LocalFilename.js";

const ContextSourceValue: FC<{ source: ContextValueSource }> = ({ source }) => {
  switch (source.type) {
    case "user":
      return (
        <Text>
          <Text color="yellow">user configuration</Text>, in{" "}
          <LocalFilename filename={source.identifier} />
        </Text>
      );
    case "terraform":
      return (
        <Text>
          <Text color="yellow">terraform state file</Text>, in{" "}
          <LocalFilename filename={source.identifier} relative />
        </Text>
      );
    default:
      return <Text color="yellow">unknown</Text>;
  }
};

const ContextSource: FC<{ source: ContextValueSource }> = ({ source }) => {
  return (
    <Text color="gray">
      (source: <ContextSourceValue source={source} />)
    </Text>
  );
};

const GetContext: FC<{ ctx: Context }> = ({ ctx }) => {
  const rows: Record<string, ReactNode> = {};
  const { renderAsJson } = useRenderContext();
  const values: Record<string, ContextValue | undefined> = {};

  let hasTerraformSource = false;

  for (const key of [
    "project-id",
    "server-id",
    "org-id",
    "installation-id",
  ] as ContextKey[]) {
    const value = usePromise(ctx.getContextValue.bind(ctx), [key]);
    if (value) {
      rows[`--${key}`] = (
        <Text>
          <Value>{value.value}</Value> <ContextSource source={value.source} />
        </Text>
      );
      values[key] = value;

      hasTerraformSource =
        hasTerraformSource || value.source.type === "terraform";
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
        <Box marginBottom={1}>
          <SingleResult title="Current CLI context" rows={rows} />
        </Box>
        {hasTerraformSource && (
          <Note marginBottom={1}>
            You are in a directory that contains a terraform state file; some of
            the context values were read from there.
          </Note>
        )}
        <Note marginBottom={1}>
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
