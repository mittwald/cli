import { BaseCommand } from "../../BaseCommand.js";
import { ReactNode, Suspense } from "react";
import { render, Text } from "ink";
import { RenderContextProvider } from "./context.js";
import { ExtendedBaseCommand } from "../../ExtendedBaseCommand.js";
import { JsonCollectionProvider } from "./json/JsonCollectionProvider.js";
import { Flags, Interfaces } from "@oclif/core";
import { FlagInput } from "@oclif/core/lib/interfaces/parser.js";
import { RendererContainer } from "./components/RendererWrapper.js";
import { CommandArgs, CommandFlags } from "../../types.js";

const renderFlags = {
  asJson: Flags.boolean({
    required: false,
    default: false,
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
    render(
      <RenderContextProvider
        value={{
          apiClient: this.apiClient,
          renderAsJson: this.renderFlags.asJson,
        }}
      >
        <JsonCollectionProvider>
          <Suspense fallback={<Text>Loading...</Text>}>
            <RendererContainer render={() => this.render()} />
          </Suspense>
        </JsonCollectionProvider>
      </RenderContextProvider>,
    );
  }

  protected abstract render(): ReactNode;
}
