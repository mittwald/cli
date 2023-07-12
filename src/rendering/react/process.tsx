import React, { ReactElement } from "react";

export type ProcessStepInfo = {
  type: "info";
  title: ReactElement;
};

export type ProcessStepRunnable = {
  type: "step";
  title: ReactElement;
  phase: "running" | "completed" | "failed" | "aborted";
};

export type ProcessStepConfirm = {
  type: "confirm";
  title: ReactElement;
  confirmed: boolean | undefined;
}

export type ProcessStep = ProcessStepInfo | ProcessStepRunnable | ProcessStepConfirm;

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
}

export interface ProcessRenderer {
  start(): void;
  addStep(title: ReactElement): RunnableHandler;
  addInfo(title: ReactElement): void;
  addConfirmation(question: ReactElement): Promise<boolean>;
  complete(summary: ReactElement): void;
}