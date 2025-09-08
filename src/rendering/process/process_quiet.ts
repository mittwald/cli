import { ProcessRenderer, RunnableHandler } from "./process.js";
import * as console from "console";

export class SilentProcessRenderer implements ProcessRenderer {
  private cleanupFns: (() => Promise<unknown>)[] = [];

  public start() {
    // 🤐
  }

  public addStep(title: string): RunnableHandler {
    return new RunnableHandler(
      { type: "step", title, phase: "aborted" },
      () => {
        // empty
      },
    );
  }

  public runStep<TRes>(
    unusedTitle: string,
    fn: (() => Promise<TRes>) | Promise<TRes>,
  ): Promise<TRes> {
    if (fn instanceof Promise) {
      return fn;
    }
    return fn();
  }

  public addInfo() {
    // 🤐
  }

  public async complete() {
    await this.cleanup();
  }

  public error(err: unknown) {
    console.error(err);
    return Promise.resolve();
  }

  public addConfirmation(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public addInput(): Promise<string> {
    throw new Error("no interactive input available in quiet mode");
  }

  public addSelect<TVal>(): Promise<TVal> {
    throw new Error("no interactive input available in quiet mode");
  }

  public addCleanup(_: string, fn: () => Promise<unknown>): void {
    this.cleanupFns.push(fn);
  }

  private async cleanup() {
    for (const fn of this.cleanupFns) {
      await fn();
    }
  }
}
