import { ReactElement, ReactNode } from "react";
import {
  ProcessRenderer,
  RunnableHandler,
  ProcessStepRunnable,
} from "./process.js";

export class SimpleProcessRenderer implements ProcessRenderer {
  private readonly title: string;
  private started = false;
  private cleanupFns: (() => Promise<unknown>)[] = [];
  private stepCounter = 0;

  public constructor(title: string) {
    this.title = title;
  }

  public start() {
    if (this.started) {
      return;
    }
    this.started = true;
    console.log(`Starting: ${this.title}\n`);
  }

  public addStep(title: ReactNode): RunnableHandler {
    this.start();
    this.stepCounter++;

    const titleText = this.renderNodeToText(title);
    console.log(`[RUNNING] Step ${this.stepCounter}: ${titleText}...`);

    const state: ProcessStepRunnable = {
      type: "step",
      title,
      phase: "running",
    };
    const stepNum = this.stepCounter;

    return new RunnableHandler(state, () => {
      const currentTitleText = this.renderNodeToText(state.title);

      if (state.phase === "completed") {
        console.log(`[COMPLETED] Step ${stepNum}: ${currentTitleText}`);
      } else if (state.phase === "failed") {
        console.log(`[FAILED] Step ${stepNum}: ${currentTitleText}`);
        if (state.error) {
          console.log(`  Error: ${state.error}`);
        }
      } else if (state.phase === "aborted") {
        console.log(`[ABORTED] Step ${stepNum}: ${currentTitleText}`);
      }

      if (state.progress) {
        console.log(`  Progress: ${state.progress}`);
      }

      if (state.output) {
        const lines = state.output
          .split("\n")
          .filter((line: string) => line.trim());
        for (const line of lines) {
          console.log(`  ${line}`);
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
    console.log(`[INFO] ${titleText}`);
  }

  public async addConfirmation(question: ReactNode): Promise<boolean> {
    this.start();
    const questionText = this.renderNodeToText(question);
    console.log(`[CONFIRM] ${questionText}`);

    console.log("[CONFIRM] Automatically confirming: true");
    return true;
  }

  public async addInput(question: ReactNode, mask?: boolean): Promise<string> {
    this.start();
    const questionText = this.renderNodeToText(question);
    const maskText = mask ? " (masked)" : "";
    console.log(`[INPUT] ${questionText}${maskText}`);

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
    console.log(`[SELECT] ${questionText}`);

    console.log("[SELECT] Available options:");
    options.forEach((option, index) => {
      const labelText = this.renderNodeToText(option.label);
      console.log(`[SELECT]   ${index + 1}. ${labelText}`);
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
    console.log("[COMPLETED] Process completed successfully\n");
    console.log(`Summary: ${summaryText}`);
  }

  public async error(err: unknown): Promise<void> {
    await this.cleanup();
    console.log(`[ERROR] Process failed: ${err?.toString()}`);
  }

  private async cleanup() {
    if (this.cleanupFns.length === 0) {
      return;
    }

    console.log("[CLEANUP] Running cleanup tasks...");
    for (let i = 0; i < this.cleanupFns.length; i++) {
      try {
        await this.cleanupFns[i]();
      } catch (err) {
        console.log(`[CLEANUP] Task ${i + 1} failed: ${err}`);
      }
    }
    console.log("[CLEANUP] Cleanup tasks completed");
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
