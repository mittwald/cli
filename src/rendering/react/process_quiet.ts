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

  public runStep<TRes>(title: React.ReactNode, fn: () => Promise<TRes>): Promise<TRes> {
    return fn();
  }

  public addInfo(title: ReactElement) {}

  public complete(summary: ReactElement) {}

  public error(err: unknown): void {
    console.error(err);
  }

  public addConfirmation(question: ReactElement): Promise<boolean> {
    return Promise.resolve(true);
  }

  public addInput(question: React.ReactElement, mask?: boolean): Promise<string> {
    throw new Error("no interactive input available in quiet mode");
  }

}
