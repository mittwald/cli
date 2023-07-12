import { ReactElement } from "react";
import { ProcessRenderer, RunnableHandler } from "./process.js";

export class SilentProcessRenderer implements ProcessRenderer {
  public constructor(title: string) {}

  public start() {}

  public addStep(title: ReactElement): RunnableHandler {
    return new RunnableHandler(
      { type: "step", title, phase: "aborted" },
      () => {},
    );
  }

  public addInfo(title: ReactElement) {}

  public complete(summary: ReactElement) {}

  public addConfirmation(question: ReactElement): Promise<boolean> {
    return Promise.resolve(true);
  }

}
