import React, { ReactElement } from "react";

type ProcessStepInfo = {
  type: "info";
  title: ReactElement;
};

type ProcessStepRunnable = {
  type: "step";
  title: ReactElement;
  phase: "running" | "completed" | "failed" | "aborted";
};

export type ProcessStep = ProcessStepInfo | ProcessStepRunnable;

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
  complete(summary: ReactElement): void;
}