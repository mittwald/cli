import React, { ReactElement, ReactNode } from "react";

export type ProcessStepInfo = {
  type: "info";
  title: ReactElement;
};

export type ProcessStepRunnable = {
  type: "step";
  title: ReactElement;
  phase: "running" | "completed" | "failed" | "aborted";
  error?: unknown;
};

export type ProcessStepConfirm = {
  type: "confirm";
  title: ReactElement;
  confirmed: boolean | undefined;
}

export type ProcessStepInput = {
  type: "input";
  title: ReactElement;
  mask?: boolean;
  value?: string;
}

export type ProcessStep = ProcessStepInfo | ProcessStepRunnable | ProcessStepConfirm | ProcessStepInput;

export class RunnableHandler {
  private listener: () => any;
  private processStep: ProcessStepRunnable;

  public constructor(state: ProcessStepRunnable, l: () => any) {
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
  addInput(question: ReactElement, mask?: boolean): Promise<string>;

  complete(summary: ReactElement): void;
  error(err: unknown): void;
}