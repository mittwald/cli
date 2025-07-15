import { FC, ReactNode, Suspense } from "react";
import { render, Text } from "ink";
import { RenderContextProvider } from "../../rendering/react/context.js";
import { UnauthenticatedExtendedBaseCommand } from "./UnauthenticatedExtendedBaseCommand.js";
import { CoreBaseCommand } from "./CoreBaseCommand.js";

const RenderComponent: FC<{ render: () => ReactNode }> = (p) => (
  <>{p.render()}</>
);

function wrapRender<TRes>(
  fn: (result: TRes) => ReactNode,
): (result: TRes) => ReactNode {
  return (result) => {
    const innerResult = fn(result);
    if (typeof innerResult === "string") {
      return <Text>{innerResult}</Text>;
    }

    return innerResult;
  };
}

export abstract class UnauthenticatedExecRenderBaseCommand<
  T extends typeof CoreBaseCommand,
  TRes,
> extends UnauthenticatedExtendedBaseCommand<T> {
  protected abstract exec(): Promise<TRes>;

  public async run(): Promise<void> {
    const result = await this.exec();
    const wrappedRender = wrapRender(this.render.bind(this));

    render(
      <RenderContextProvider
        value={{
          apiClient: this.apiClient,
          renderAsJson: false,
        }}
      >
        <Suspense fallback={<Text>Loading...</Text>}>
          <RenderComponent render={() => wrappedRender(result)} />
        </Suspense>
      </RenderContextProvider>,
    );
  }

  protected abstract render(executionResult: TRes): ReactNode;
}
