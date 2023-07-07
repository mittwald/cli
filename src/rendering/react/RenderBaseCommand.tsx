import { BaseCommand } from "../../BaseCommand.js";
import { FC, ReactNode, Suspense } from "react";
import { render, Text } from "ink";
import { RenderContextProvider } from "./context.js";
import { ExtendedBaseCommand } from "../../ExtendedBaseCommand.js";

const RenderComponent: FC<{ render: () => ReactNode }> = (p) => (
  <>{p.render()}</>
);

export abstract class RenderBaseCommand<
  T extends typeof BaseCommand,
> extends ExtendedBaseCommand<T> {
  public async run(): Promise<void> {
    render(
      <RenderContextProvider
        value={{
          apiClient: this.apiClient,
        }}
      >
        <Suspense fallback={<Text>Loading...</Text>}>
          <RenderComponent render={() => this.render()} />
        </Suspense>
      </RenderContextProvider>,
    );
  }

  protected abstract render(): ReactNode;
}
