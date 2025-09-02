import { ReactElement, ReactNode } from "react";
import {
  ProcessRenderer,
  RunnableHandler,
  ProcessStepRunnable,
} from "./process.js";
import { Writable } from "stream";

export class SimpleProcessRenderer implements ProcessRenderer {
  private readonly title: string;
  private readonly output: Writable;

  private started = false;
  private cleanupFns: (() => Promise<unknown>)[] = [];
  private stepCounter = 0;

  public constructor(title: string, output: Writable) {
    this.title = title;
    this.output = output;
  }

  public start() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.output.write(`Starting: ${this.title}\n\n`);
  }

  public addStep(title: ReactNode): RunnableHandler {
    this.start();
    this.stepCounter++;

    const titleText = this.renderNodeToText(title);
    this.output.write(`Step ${this.stepCounter}: ${titleText}... `);

    const state: ProcessStepRunnable = {
      type: "step",
      title,
      phase: "running",
    };

    return new RunnableHandler(state, () => {
      if (state.phase === "completed") {
        this.output.write("completed\n");
      } else if (state.phase === "failed") {
        this.output.write("FAILED\n");
        if (state.error) {
          this.output.write(`  Error: ${state.error}\n`);
        }
      } else if (state.phase === "aborted") {
        this.output.write("aborted\n");
      }

      if (state.progress) {
        this.output.write(`  Progress: ${state.progress}\n`);
      }

      if (state.output) {
        const lines = state.output
          .split("\n")
          .filter((line: string) => line.trim());

        this.output.write("got output:\n");
        for (const line of lines) {
          this.output.write(`  ${line}\n`);
        }
      }
    });
  }

  public async runStep<TRes>(
    title: ReactNode,
    fn: (() => Promise<TRes>) | Promise<TRes>,
  ): Promise<TRes> {
    const step = this.addStep(title);
    try {
      const promise = typeof fn === "function" ? fn() : fn;
      const result = await promise;
      step.complete();
      return result;
    } catch (err) {
      step.error(err);
      throw err;
    }
  }

  public addInfo(title: ReactNode) {
    this.start();
    const titleText = this.renderNodeToText(title);
    this.output.write(`Info: ${titleText}\n`);
  }

  public async addConfirmation(question: ReactNode): Promise<boolean> {
    this.start();
    const questionText = this.renderNodeToText(question);

    this.output.write(`Confirm: ${questionText}; automatically confirmed\n`);

    return true;
  }

  public async addInput(question: ReactNode, mask?: boolean): Promise<string> {
    this.start();
    const questionText = this.renderNodeToText(question);
    const maskText = mask ? " (masked)" : "";

    this.output.write(
      `Input: ${questionText}${maskText}; no input available\n`,
    );

    // For non-interactive use, throw an error
    throw new Error(
      "Interactive input not available in simple process renderer",
    );
  }

  public async addSelect<TVal>(
    question: ReactNode,
    options: { value: TVal; label: ReactNode }[],
  ): Promise<TVal> {
    this.start();
    const questionText = this.renderNodeToText(question);

    this.output.write(`Selection: ${questionText}\n`);
    this.output.write("Available options:\n");

    options.forEach((option, index) => {
      const labelText = this.renderNodeToText(option.label);
      this.output.write(`  ${index + 1}. ${labelText}\n`);
    });

    throw new Error(
      "Interactive selection not available in simple process renderer",
    );
  }

  public addCleanup(title: ReactNode, fn: () => Promise<unknown>): void {
    this.cleanupFns.push(fn);
  }

  public async complete(summary: ReactElement): Promise<void> {
    await this.cleanup();

    const summaryText = this.renderNodeToText(summary);
    this.output.write("Completed: Process completed successfully\n\n");
    this.output.write(`Summary: ${summaryText}\n`);
  }

  public async error(err: unknown): Promise<void> {
    await this.cleanup();
    this.output.write(`ERROR: Process failed: ${err?.toString()}\n`);
  }

  private async cleanup() {
    if (this.cleanupFns.length === 0) {
      return;
    }

    this.output.write("Cleanup: Running cleanup tasks... ");
    for (let i = 0; i < this.cleanupFns.length; i++) {
      try {
        await this.cleanupFns[i]();
      } catch (err) {
        this.output.write(`task ${i + 1} failed: ${err}`);
      }
    }

    this.output.write("completed\n");
  }

  private renderNodeToText(node: ReactNode): string {
    if (typeof node === "string") {
      return node;
    }
    if (typeof node === "number") {
      return node.toString();
    }
    if (node === null || node === undefined) {
      return "";
    }
    if (typeof node === "boolean") {
      return node.toString();
    }

    // For React elements and complex nodes, provide a simple fallback
    if (typeof node === "object") {
      // Check if it's a React element with props.children
      if ("props" in node && node.props && typeof node.props === "object") {
        const props = node.props as Record<string, unknown>;
        if (props.children && typeof props.children === "string") {
          return props.children;
        }
      }
      return "[Complex content]";
    }

    return String(node);
  }
}
