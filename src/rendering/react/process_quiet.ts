import { ReactNode } from "react";
import { ProcessRenderer, RunnableHandler } from "./process.js";

export class SilentProcessRenderer implements ProcessRenderer {
  public start() {
    // 🤐
  }

  public addStep(title: ReactNode): RunnableHandler {
    return new RunnableHandler(
      { type: "step", title, phase: "aborted" },
      () => {
        // empty
      },
    );
  }

  public runStep<TRes>(
    unusedTitle: ReactNode,
    fn: () => Promise<TRes>,
  ): Promise<TRes> {
    return fn();
  }

  public addInfo() {
    // 🤐
  }

  public complete() {
    // 🤐
  }

  public error(err: unknown): void {
    console.error(err);
  }

  public addConfirmation(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public addInput(): Promise<string> {
    throw new Error("no interactive input available in quiet mode");
  }
}
