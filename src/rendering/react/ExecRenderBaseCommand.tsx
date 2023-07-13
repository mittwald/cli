import { BaseCommand } from "../../BaseCommand.js";
import { FC, ReactNode, Suspense } from "react";
import { render, Text } from "ink";
import { RenderContextProvider } from "./context.js";
import { ExtendedBaseCommand } from "../../ExtendedBaseCommand.js";

const RenderComponent: FC<{ render: () => ReactNode }> = (p) => (
  <>{p.render()}</>
);

export abstract class ExecRenderBaseCommand<
  T extends typeof BaseCommand,
  TRes,
> extends ExtendedBaseCommand<T> {
  protected abstract exec(): Promise<TRes>;

  public async run(): Promise<void> {
    const result = await this.exec();

    render(
      <RenderContextProvider
        value={{
          apiClient: this.apiClient,
          renderAsJson: false,
        }}
      >
        <Suspense fallback={<Text>Loading...</Text>}>
          <RenderComponent render={() => this.render(result)} />
        </Suspense>
      </RenderContextProvider>,
    );
  }

  protected abstract render(executionResult: TRes): ReactNode;
}
