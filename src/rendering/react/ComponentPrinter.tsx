import { ReactElement, Suspense } from "react";
import { Printer } from "../Printer.js";
import { Render } from "./components/Render.js";
import { render, Text } from "ink";

export class ComponentPrinter<T> implements Printer<T> {
  private render: (r: T) => ReactElement;

  public constructor(render: (r: T) => ReactElement) {
    this.render = render;
  }

  public log(content: T): void {
    render(
      <Suspense fallback={<Text>Loading...</Text>}>
        <Render render={() => this.render(content)} />
      </Suspense>,
    ).unmount();
  }
}
