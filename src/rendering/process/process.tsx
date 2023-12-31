import { ReactElement, ReactNode } from "react";

export type ProcessStepInfo = {
  type: "info";
  title: ReactNode;
};

export type ProcessStepRunnable = {
  type: "step";
  title: ReactNode;
  phase: "running" | "completed" | "failed" | "aborted";
  error?: unknown;
  progress?: string;
};

export type ProcessStepConfirm = {
  type: "confirm";
  title: ReactNode;
  confirmed: boolean | undefined;
};

export type ProcessStepInput = {
  type: "input";
  title: ReactNode;
  mask?: boolean;
  value?: string;
};

export type ProcessStep =
  | ProcessStepInfo
  | ProcessStepRunnable
  | ProcessStepConfirm
  | ProcessStepInput;

export class RunnableHandler {
  private readonly listener: () => void;
  private readonly processStep: ProcessStepRunnable;

  public constructor(state: ProcessStepRunnable, l: () => void) {
    this.processStep = state;
    this.listener = l;
  }

  public get done(): boolean {
    return this.processStep.phase !== "running";
  }

  public abort() {
    this.processStep.phase = "aborted";
    this.listener();
  }

  public complete() {
    this.processStep.phase = "completed";
    this.listener();
  }

  public progress(p: string) {
    this.processStep.progress = p;
    this.listener();
  }

  public error(err: unknown) {
    this.processStep.phase = "failed";
    this.processStep.error = err;
    this.listener();
  }
}

export interface ProcessRenderer {
  start(): void;
  addStep(title: ReactNode): RunnableHandler;
  runStep<TRes>(title: ReactNode, fn: () => Promise<TRes>): Promise<TRes>;
  addInfo(title: ReactElement): void;
  addConfirmation(question: ReactElement): Promise<boolean>;
  addInput(question: ReactNode, mask?: boolean): Promise<string>;

  complete(summary: ReactElement): void;
  error(err: unknown): void;
}
