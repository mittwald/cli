import { BaseCommand } from "../../BaseCommand.js";
import { ReactNode, Suspense } from "react";
import { render } from "ink";
import { RenderContextProvider } from "./context.js";
import { ExtendedBaseCommand } from "../../ExtendedBaseCommand.js";
import { JsonCollectionProvider } from "./json/JsonCollectionProvider.js";
import { Flags, Interfaces } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces/parser.js";
import { Render } from "./components/Render.js";
import { CommandArgs, CommandFlags } from "../../types.js";
import { useIncreaseInkStdoutColumns } from "./hooks/useIncreaseInkStdoutColumns.js";
import { usePromise } from "@mittwald/react-use-promise";
import { CommandType } from "../../lib/context_flags.js";
import ErrorBoundary from "./components/ErrorBoundary.js";

const renderFlags = {
  output: Flags.string({
    description:
      "The output format to use; use 'txt' for a human readable text representation, and 'json' for a machine-readable JSON representation.",
    char: "o",
    required: true,
    default: "txt",
    options: ["txt", "json"],
  }),
};

export abstract class RenderBaseCommand<
  T extends typeof BaseCommand,
> extends ExtendedBaseCommand<T> {
  protected static renderFlags = renderFlags;

  protected renderFlags!: Interfaces.InferredFlags<typeof renderFlags>;

  public static buildFlags(): FlagInput {
    return RenderBaseCommand.renderFlags;
  }

  public async init(): Promise<void> {
    await super.init();

    const { args, flags } = await this.parse({
      flags: {
        ...renderFlags,
        ...this.ctor.flags,
      },
      baseFlags: (super.ctor as typeof ExtendedBaseCommand).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });

    this.flags = flags as CommandFlags<T>;
    this.renderFlags = flags as Interfaces.InferredFlags<typeof renderFlags>;
    this.args = args as CommandArgs<T>;
  }

  public async run(): Promise<void> {
    const onError = () => {
      setImmediate(() => {
        handle.unmount();
        process.exit(1);
      });
    };

    const handle = render(
      <RenderContextProvider
        value={{
          apiClient: this.apiClient,
          renderAsJson: this.renderFlags.output === "json",
        }}
      >
        <JsonCollectionProvider>
          <Suspense>
            <ErrorBoundary onError={onError}>
              <Render
                render={() => {
                  useIncreaseInkStdoutColumns();
                  return this.render();
                }}
              />
            </ErrorBoundary>
          </Suspense>
        </JsonCollectionProvider>
      </RenderContextProvider>,
    );
  }

  protected abstract render(): ReactNode;

  protected useAppInstallationId(
    command: CommandType<"installation"> | "flag" | "arg",
  ): string {
    return usePromise(() => this.withAppInstallationId(command), []);
  }

  protected useProjectId(
    command: CommandType<"project"> | "flag" | "arg",
  ): string {
    return usePromise(() => this.withProjectId(command), []);
  }
}
